const DataEngine = (() => {

  let lmop = null;
  let bestiary = null;

  // Load both JSON files
  async function init() {
    const [lmopRes, bestiaryRes] = await Promise.all([
      fetch('/data/lmop.json'),
      fetch('/data/bestiary-mm.json')
    ]);
    lmop = await lmopRes.json();
    bestiary = await bestiaryRes.json();
    console.log('[DataEngine] Loaded. Chapters:', lmop.data.length, '| Monsters:', bestiary.monster.length);
  }

  // Recursively walk entries tree and extract numbered rooms
  function walkEntries(entries, rooms = []) {
    if (!Array.isArray(entries)) return rooms;
    for (const entry of entries) {
      if (entry.type === 'entries' && entry.name && /^\d+\./.test(entry.name)) {
        // Extract read-aloud text
        const readAloud = [];
        const creatures = new Set();
        const treasure = [];

        function walkChildren(children) {
          if (!Array.isArray(children)) return;
          for (const child of children) {
            if (child.type === 'insetReadaloud') {
              const text = extractText(child.entries);
              readAloud.push(text);
            }
            if (child.type === 'entries' && child.name === 'Treasure') {
              treasure.push(extractText(child.entries));
            }
            // Parse {@creature X} tags from all text
            const raw = JSON.stringify(child);
            const matches = [...raw.matchAll(/\{@creature ([^|}]+)/g)];
            matches.forEach(m => creatures.add(m[1].trim()));
            // Recurse
            if (child.entries) walkChildren(child.entries);
            if (child.items) walkChildren(child.items);
          }
        }
        walkChildren(entry.entries);

        rooms.push({
          id: entry.id || null,
          name: entry.name,
          readAloud,
          creatures: [...creatures],
          treasure,
          raw: entry
        });
      }
      // Always recurse into sections
      if (entry.entries) walkEntries(entry.entries, rooms);
    }
    return rooms;
  }

  // Flatten entry text nodes into a single string
  function extractText(entries) {
    if (!entries) return '';
    return entries.map(e => {
      if (typeof e === 'string') return e;
      if (e.entries) return extractText(e.entries);
      if (e.items) return extractText(e.items);
      return '';
    }).join(' ').replace(/\{@[^}]+\}/g, m => {
      // Strip tags like {@creature Goblin} â†’ Goblin, {@b text} â†’ text
      const inner = m.replace(/\{@\w+ ([^|}]+)[^}]*\}/, '$1');
      return inner;
    });
  }

  // Get all rooms across all chapters
  function getAllRooms() {
    if (!lmop) return [];
    return walkEntries(lmop.data);
  }

  // Get rooms for a specific chapter index (0-7)
  function getChapterRooms(chapterIndex) {
    if (!lmop) return [];
    const chapter = lmop.data[chapterIndex];
    if (!chapter) return [];
    return walkEntries([chapter]);
  }

  // Get chapter names
  function getChapters() {
    if (!lmop) return [];
    return lmop.data.map((c, i) => ({ index: i, name: c.name, id: c.id }));
  }

  // Look up a monster by name (case-insensitive)
  function getMonster(name) {
    if (!bestiary) return null;
    return bestiary.monster.find(m => m.name.toLowerCase() === name.toLowerCase()) || null;
  }

  // Format a monster into a clean stat block string for AI context
  function formatMonsterBlock(monster) {
    if (!monster) return '';
    const ac = Array.isArray(monster.ac) ? monster.ac[0].ac || monster.ac[0] : monster.ac;
    const hp = monster.hp?.average || '?';
    const cr = monster.cr?.cr || monster.cr || '?';
    return `${monster.name} | CR ${cr} | HP ${hp} | AC ${ac} | STR ${monster.str} DEX ${monster.dex} CON ${monster.con} INT ${monster.int} WIS ${monster.wis} CHA ${monster.cha}`;
  }

  return { init, getAllRooms, getChapterRooms, getChapters, getMonster, formatMonsterBlock, extractText };

})();

export { DataEngine };
window.DataEngine = DataEngine;

