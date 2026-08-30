import { CHARS, SHEETS } from '../services/characters.js';

// Live preview panel. This used to be a full-screen detail sheet you
// navigated to and back out of; it is now a fixed panel under the roster grid
// that simply re-renders when a cell is tapped. Nothing slides, nothing
// covers the roster, and the whole cast stays visible while you compare.

let activeId = null;

export function getActiveId() { return activeId; }

export function showPreview(id) {
  activeId = id;
  window.activeId = id;

  const c = CHARS.find(x => x.id === id);
  const s = SHEETS[id];

  document.getElementById('pvEmpty').hidden = true;
  document.getElementById('pvBody').hidden = false;

  document.getElementById('pvEmblem').style.backgroundImage =
    `url('${window.IMGS[c.imgKey] || ''}')`;
  document.getElementById('pvName').textContent = c.short || c.name;
  document.getElementById('pvCls').textContent = c.cls;
  document.getElementById('pvRole').textContent = c.role || '';

  // Three numbers, in plain words. Anyone who has never played D&D can read
  // "Health / Armour / Speed" faster than "HP / AC / SPD".
  document.getElementById('pvStats').innerHTML = [
    ['Health', s.hp], ['Armour', s.ac], ['Speed', s.speed],
  ].map(([label, val]) => `
    <div class="pv-stat">
      <div class="pv-stat-v">${val}</div>
      <div class="pv-stat-l">${label}</div>
    </div>`).join('');
}

export function initDetailPanel() {
  document.getElementById('pvGo')
    .addEventListener('click', () => activeId && window.openSheet(activeId));
}
