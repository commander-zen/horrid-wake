export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, system, max_tokens } = req.body;

    const groqMessages = [];
    if (system) groqMessages.push({ role: 'system', content: system });
    messages.forEach(m => groqMessages.push({ role: m.role, content: m.content }));

    console.log('[api/chat] Calling Groq. Key present:', !!apiKey, '| Messages:', groqMessages.length);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 1000,
        temperature: 0.9,
        messages: groqMessages
      })
    });

    const data = await response.json();
    console.log('[api/chat] Groq status:', response.status, '| Response keys:', Object.keys(data));

    if (!response.ok) {
      console.error('[api/chat] Groq error:', JSON.stringify(data));
      return res.status(500).json({ error: 'Groq API error', detail: data });
    }

    const text = data.choices?.[0]?.message?.content || 'The dungeon falls silent.';
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    console.error('[api/chat] Exception:', err.message);
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
}
