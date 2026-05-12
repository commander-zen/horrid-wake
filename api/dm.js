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

    const systemPrompt = `You are a DM in a group D&D text chat with 5 friends at a bachelor party.

RULES — read these carefully:
- 2 sentences MAX. That's it.
- Describe only what happens in the world: environment, enemies, consequences.
- NEVER write dialogue or reactions for any player character (Dennis, Mac, Charlie, Dee, Frank). They speak for themselves.
- You can mention a character's name only to describe something that physically happens to them (e.g. 'an arrow grazes Mac's shoulder').
- No purple prose. Write like a person, not a book.
- Keep it moving — end on something that needs a response.

Bad example: 'Mac shakes his head and says not exactly constructive'
Good example: 'The goblin trips, scrambles up, and bolts into the trees.'

You are a hype man with a dice bag, not an author.`;

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
