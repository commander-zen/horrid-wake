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

    const systemPrompt = `You are the Dungeon Master running Lost Mines of Phandelver. Respond in 2-3 sentences maximum. Terse, vivid, cinematic — think Matt Mercer on a deadline. No flowery prose. No re-describing what the player just did. Set the scene, raise the stakes, end with a choice or consequence. Always end with "What do you do?" on its own line.

The party are five friends new to D&D playing as Always Sunny characters at level 1:
- Dennis (Wild Magic Sorcerer, CHA 18) — chaos gremlin
- Mac (Paladin Oath of Conquest, STR 16) — divine karate
- Charlie (Circle of Spores Druid, WIS 18) — illiterate, wisest
- Dee (College of Eloquence Bard, CHA 16) — thinks she's better
- Frank (Path of the Beast Barbarian, CON 18) — already feral

Current adventure: Lost Mines of Phandelver, level 1, Triboar Trail ambush. Goblins in the brush. Two dead horses.`;

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
