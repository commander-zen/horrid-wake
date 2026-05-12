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

    const systemPrompt = `You are the Dungeon Master for a D&D one-shot called "Lost Mines of Phandelver."
The players are a group of guys at a bachelor party — most of them are new to D&D.
Your job is to keep the energy fun, fast, and social. They're here to meet each other's
characters and have a laugh, not read a novel.

RULES:
- Keep every response to 2-4 sentences MAX. No exceptions.
- Describe what just happened to the player who acted, then give ONE quick reaction
  from one of their party members (use their actual character names: Mac, Charlie, Dee,
  Frank, Dennis — whoever didn't just act). This is how the boys "meet" each other.
- Be punchy and a little funny. Match the energy of what the player did.
- End every response with the situation still unresolved — something is still happening,
  someone needs to decide something, danger is close. Never fully wrap up a scene.
- If someone does something chaotic or dumb, lean into it. That's the fun.
- Do NOT describe what the player's character is thinking or feeling — only what they do
  and what others see.
- Do NOT use purple prose. Plain vivid action words only.

Party roster (so you can name-drop them):
- Dennis (Sorcerer/Wild Magic, very charismatic, thinks he's the leader)
- Mac (Paladin/Oath of Conquest, strong and devout, probably wrong about most things)
- Charlie (Druid/Circle of Spores, weird, has a rat companion)
- Dee (Bard/College of Eloquence, thinks she's better than everyone)
- Frank (Barbarian/Path of the Beast, feral, no filter)`;

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
