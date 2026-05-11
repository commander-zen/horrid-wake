const REPO_BASE = 'https://raw.githubusercontent.com/5etools-mirror-3/5etools-src/v2.25.1/data';

const SOURCES = [
  'adventure/adventure-lmop.json',
  'bestiary/bestiary-mm.json',
  'items.json',
  'spells.json',
];

const dataCache = {};

async function fetchSource(file) {
  if (dataCache[file]) return dataCache[file];
  try {
    const res = await fetch(`${REPO_BASE}/${file}`);
    if (!res.ok) return null;
    const json = await res.json();
    dataCache[file] = json;
    return json;
  } catch { return null; }
}

function extractRelevant(file, data, context) {
  const q = context.toLowerCase();
  const match = (name) => name?.toLowerCase().split(' ').some(w => q.includes(w) && w.length > 3);
  const cap = (arr, limit) => JSON.stringify(arr, null, 1).substring(0, limit);

  if (file.includes('adventure-lmop') && data.data) {
    const areas = data.data.filter(section =>
      match(section.name) || JSON.stringify(section).toLowerCase().includes(q.substring(0, 30))
    ).slice(0, 3);
    return areas.length ? cap(areas, 12000) : cap(data.data.slice(0, 2), 8000);
  }
  if (file.includes('bestiary') && data.monster) {
    const m = data.monster.filter(mn => match(mn.name)).slice(0, 4);
    return m.length ? cap(m, 10000) : null;
  }
  if (file.includes('item') && data.item) {
    const m = data.item.filter(i => match(i.name)).slice(0, 4);
    return m.length ? cap(m, 5000) : null;
  }
  if (file.includes('spell') && data.spell) {
    const m = data.spell.filter(s => match(s.name)).slice(0, 4);
    return m.length ? cap(m, 5000) : null;
  }
  return null;
}

async function buildContext(recentMessages) {
  const contextString = recentMessages.map(m => m.content).join(' ');
  let context = '';
  let total = 0;

  const results = await Promise.all(SOURCES.map(async file => {
    const data = await fetchSource(file);
    return { file, data };
  }));

  for (const { file, data } of results) {
    if (!data || total > 40000) continue;
    const chunk = extractRelevant(file, data, contextString);
    if (chunk) {
      context += `\n\n--- ${file} ---\n${chunk}`;
      total += chunk.length;
    }
  }
  return context;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = process.env.GROQ_KEY;
  if (!groqKey) return res.status(500).json({ error: 'Missing GROQ_KEY' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const context = await buildContext(messages);

  const systemPrompt = `You are the Dungeon Master running Lost Mines of Phandelver for a group of first-time D&D players. You narrate in the voice and style of Matthew Mercer — vivid, cinematic, warm, immersive, with occasional dry wit. You speak in second-person present tense ("You see...", "Before you stands...").

Rules:
- Never mention dice, stats, AC, HP, or any game mechanics by name
- Keep each response under 150 words
- End each beat open — let players decide what to do next
- If a new character joins mid-session, weave them in naturally
- Track NPCs, locations, and plot threads mentioned in the conversation history
- The adventure begins on the Triboar Trail with a goblin ambush on Gundren Rockseeker's wagon

Key NPCs: Gundren Rockseeker (dwarf patron, been captured), Sildar Hallwinter (human fighter, ally), Klarg (bugbear chief), the Black Spider (main villain, revealed later).

${context ? `Relevant adventure and monster data from the official module:\n${context}` : ''}`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      return res.status(groqRes.status).json({ error: err.error?.message ?? 'Groq error' });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content ?? 'The dungeon stirs in silence...';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
