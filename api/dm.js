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

    const systemPrompt = `You are the DM in a group D&D chat with 5 friends. Respond in 2-3 sentences max. You're talking to the whole group, not one person. Be reactive, funny, and keep the scene moving. Name-drop the other party members when it makes sense. The party: Dennis (Wild Magic Sorcerer, charismatic disaster), Mac (Conquest Paladin, jacked and wrong about everything), Charlie (Spores Druid, unhinged, has a rat), Dee (Eloquence Bard, thinks she's the best, she's not), Frank (Beast Barbarian, already in beast mode). Never write more than 3 sentences. End on an unresolved moment.`;

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
