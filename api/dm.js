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

    let systemPrompt = `You are a DM in a group D&D text chat with 5 friends at a bachelor party.

RULES:
- Describe only what happens in the world: environment, enemies, consequences.
- NEVER write dialogue or reactions for any player character (Dennis, Mac, Charlie, Dee, Frank). They speak for themselves.
- You can mention a character's name only to describe something that physically happens to them.
- No purple prose. Write like a person, not a book.
- Keep it moving — end on something that needs a response.

You must respond in JSON with this exact shape:
{ "narration": "...", "combatTrigger": null, "combatEnd": false }

- narration: your 1-2 sentence DM response (2 sentences MAX)
- combatTrigger: if the narrative has reached a moment where combat should begin, set this to { "enemies": [] } using ONLY these valid enemy types: goblin, bugbear, wolf, skeleton, zombie, redbrand, nothic, glasstaff. Pick enemies appropriate to the scene and Lost Mines of Phandelver encounter tables. Otherwise null.
- combatEnd: true if all enemies are dead or fled and combat should end. Otherwise false.

IMPORTANT: Only set combatTrigger once. If combatActive is true, NEVER set combatTrigger — set it to null always.

Return ONLY the JSON object. No markdown. No backticks. No explanation.`;

    if (combatContext) {
      systemPrompt += `\n\nCOMBAT MODE: You have been given the mechanical result of what just happened (who attacked, roll total, hit or miss, damage dealt). Narrate ONLY that result in the narration field. Do not invent additional actions. Do not write player dialogue. Just describe what the dice already decided.`;
    }

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
        max_tokens: max_tokens || 300,
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

    // Safety: never allow combatTrigger if combatActive was passed as true
    if (combatActive && parsed.combatTrigger) {
      parsed.combatTrigger = null;
    }

    return res.status(200).json({
      narration:     parsed.narration     || 'The dungeon falls silent.',
      combatTrigger: parsed.combatTrigger || null,
      combatEnd:     parsed.combatEnd     || false,
    });

  } catch (err) {
    console.error('[api/dm] Exception:', err.message);
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
};
