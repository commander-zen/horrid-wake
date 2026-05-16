module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, max_tokens, combatContext, combatActive } = req.body;

    const systemPrompt = `You are the Dungeon Master for a D&D 5e campaign: Lost Mines of Phandelver, level 1. The party is the Always Sunny gang — Dennis (he/him, Wild Magic Sorcerer, CHA 16), Mac (he/him, Paladin, STR 16), Charlie (he/him, Druid, WIS 18), Dee (she/her, Bard, CHA 16), Frank (he/him, Barbarian, CON 14). Level 1 proficiency bonus is +2.

VOICE:
- Punchy, atmospheric, immersive. No purple prose. No "you take X damage" in narrative.
- NEVER write dialogue or reactions for any PC. They speak for themselves.
- Maximum 3 sentences of narrative. End on something that demands response.
- All numbers live in mechanicalEvents and sentence.mechanic — never in narrative prose.
- Use correct pronouns for each character: Dennis he/him, Mac he/him, Charlie he/him, Dee she/her, Frank he/him.

MECHANICAL EVENTS — surface ALL of these:
- hp_change: every hit point gain or loss (display: "Name: new/max HP (±N)")
- spell_slot: every spell slot spent (display: "Name used a Xth-level slot")
- status: conditions applied or removed (display: "Name is [condition]")
- resource: class resources used (Rage, Lay on Hands, Bardic Inspiration, Tides of Chaos, Symbiotic Entity, etc.). Use the EXACT ability name from the combat context. display: "Name used [exact ability name from context]"
- death_save: every death saving throw (display: "Name death save: [success/fail]")

DAMAGE BREAKDOWN — universal rule:
Whenever a hit deals multiple damage types or sources (bonus damage from a class feature, spell, smite, sneak attack, spore damage, Wild Magic surge, etc.), emit a SEPARATE hp_change mechanicalEvents entry for each damage source. Never collapse multi-source damage into a single number.
Format each source entry as:
  { "type": "hp_change", "character": "...", "display": "XdY+Z = N [damage type] ([source])" }
Then add a final summary hp_change entry with the combined total HP result.
Examples of multi-source damage that MUST be split:
- Mac's Divine Smite: weapon damage entry + smite damage entry + summary entry
- Dee's Sneak Attack: weapon damage entry + sneak attack entry + summary entry
- Charlie's Symbiotic Entity spores: weapon damage entry + spore damage entry + summary entry
- Dennis's Wild Magic surge bonus damage: spell damage entry + surge damage entry + summary entry

SENTENCE MECHANICS — for each sentence that involves a die roll, explain it plainly:
- Include: what die was rolled, the raw result, all modifiers, the total, what it was compared against, and the outcome.
- Example: "Dennis rolled a 12 on the d20, plus his +5 spell attack bonus, for a 17 — beating the goblin's AC 13 by 4."
- If no roll was involved, mechanic is null.

COMBAT:
- combatTrigger: if combat begins, set to { "enemies": [...] } using ONLY: goblin, bugbear, wolf, skeleton, zombie, redbrand, nothic, glasstaff. Otherwise null.
- combatEnd: true if all enemies are dead or fled. Otherwise false.
- If combatActive is true, NEVER set combatTrigger — always null.${combatContext ? '\n\nCOMBAT MODE: The mechanical result (attacker, roll, hit/miss, damage) is given. Narrate ONLY that result. Do not invent additional actions or player dialogue.' : ''}

Respond with ONLY this JSON. No markdown. No backticks. No explanation outside the JSON.

{
  "narrative": "Full narrative prose as a single string for display.",
  "mechanicalEvents": [
    {
      "type": "hp_change",
      "character": "Mac",
      "display": "1d6+3 = 7 piercing (longsword)",
      "detail": "Mac rolled 1d6+3 weapon damage."
    },
    {
      "type": "hp_change",
      "character": "Mac",
      "display": "2d8 = 9 radiant (Divine Smite)",
      "detail": "Mac expended a 1st-level spell slot for Divine Smite."
    },
    {
      "type": "hp_change",
      "character": "Mac",
      "display": "Goblin: 12/20 HP (−16 total)",
      "detail": "7 piercing + 9 radiant = 16 total damage."
    }
  ],
  "sentences": [
    { "text": "The goblin's blade finds a gap in Mac's armor.", "mechanic": "Goblin rolled 14 + 4 attack = 18, exactly matching Mac's AC 18 — a hit for 1d6+2 = 8 damage." },
    { "text": "Frank roars and charges.", "mechanic": null }
  ],
  "combatTrigger": null,
  "combatEnd": false
}`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    if (combatContext) {
      groqMessages.push({ role: 'user', content: combatContext });
    }

    console.log('[api/dm] Calling Groq. Messages:', groqMessages.length, combatContext ? '(combat)' : '', combatActive ? '[combat active]' : '');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 700,
        temperature: 0.8,
        messages: groqMessages,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    console.log('[api/dm] Groq status:', response.status);

    if (!response.ok) {
      console.error('[api/dm] Groq error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Groq API error', detail: data });
    }

    const raw = data.choices?.[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('[api/dm] JSON parse failed:', raw);
      parsed = {};
    }

    if (combatActive && parsed.combatTrigger) {
      parsed.combatTrigger = null;
    }

    const narrative = parsed.narrative || parsed.narration || 'The dungeon falls silent.';

    return res.status(200).json({
      narrative:        narrative,
      sentences:        Array.isArray(parsed.sentences) ? parsed.sentences : [],
      mechanicalEvents: Array.isArray(parsed.mechanicalEvents) ? parsed.mechanicalEvents : [],
      combatTrigger:    parsed.combatTrigger || null,
      combatEnd:        parsed.combatEnd     || false,
    });

  } catch (err) {
    console.error('[api/dm] Exception:', err.message);
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
};
