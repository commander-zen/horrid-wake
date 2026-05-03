export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, system, max_tokens } = req.body;

    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const body = {
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: max_tokens || 1000,
        temperature: 0.9
      }
    };

    console.log('[api/chat] Calling Gemini. Key present:', !!apiKey, '| Messages:', messages.length);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    console.log('[api/chat] Gemini status:', response.status, '| Response keys:', Object.keys(data));

    if (!response.ok) {
      console.error('[api/chat] Gemini error body:', JSON.stringify(data));
      return res.status(500).json({ error: 'Gemini API error', detail: data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'The dungeon falls silent.';
    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (err) {
    console.error('[api/chat] Exception:', err.message);
    return res.status(500).json({ error: 'Upstream API error', detail: err.message });
  }
}
