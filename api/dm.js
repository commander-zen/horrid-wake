module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, max_tokens } = req.body;

    const systemPrompt = `You are the Dungeon Master for an async group chat D&D session. The players send messages in character and you respond to advance the story.

Adventure: Lost Mines of Phandelver. The party is level 1.

Party:
- Dennis (Wild Magic Sorcerer, CHA 18) — chaos gremlin, magic always misfires spectacularly
- Mac (Paladin, Oath of Conquest, STR 16) — divine karate, oath poorly understood
- Charlie (Circle of Spores Druid, WIS 18) — illiterate, INT 4, talks to rats, most competent
- Dee (College of Eloquence Bard, CHA 16) — classically trained, Inspiration dice are d4 not d10
- Frank (Path of the Beast Barbarian, CON 18) — no armor ever, already feral before raging

Tone: grimdark, Frazetta-inspired. Vivid, punishing combat. Occasional black comedy. Never sanitize consequences.

Rules:
- Roll dice narratively — describe outcomes, never ask players to roll
- Respond to the most recent player action(s) and advance the scene
- Keep responses under 150 words unless a major story beat demands more
- Do not recap what the player just said
- End with an open situation that demands a decision, not a prompt asking "what do you do?"
- Player messages are prefixed with [CharacterName]: — respond to them in aggregate if multiple actions land at once`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    console.log('[api/dm] Calling Groq. Messages:', groqMessages.length);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 300,
        temperature: 0.9,
        messages: groqMessages
      })
    });

    const data = await response.json();
    console.log('[api/dm] Groq status:', response.status);

    if (!response.ok) {
      console.error('[api/dm] Groq error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Groq API error', detail: data });
    }

    const text = data.choices?.[0]?.message?.content || 'The dungeon falls silent.';
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    console.error('[api/dm] Exception:', err.message);
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
};
