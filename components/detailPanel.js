import { CHARS, SHEETS, KNOWN_DIBS } from '../services/characters.js';

// Live preview panel. This used to be a full-screen detail sheet you
// navigated to and back out of; it is now a fixed panel under the roster grid
// that simply re-renders when a cell is tapped. Nothing slides, nothing
// covers the roster, and the whole cast stays visible while you compare.
//
// DIBS is read-only and seeded from KNOWN_DIBS in characters.js. In-app
// claiming was built and then removed on purpose: localStorage is per-device,
// so a claim made on one phone was invisible on every other one -- which is
// the opposite of what "that slot is filled" needs to mean. Claims are called
// in the group chat and Ben seeds them here, so all eight phones agree.
export function getDibs() { return { ...KNOWN_DIBS }; }

let activeId = null;

export function getActiveId() { return activeId; }

export function showPreview(id) {
  activeId = id;
  window.activeId = id;

  const c = CHARS.find(x => x.id === id);
  const s = SHEETS[id];

  document.getElementById('pvEmpty').hidden = true;
  document.getElementById('pvBody').hidden = false;

  document.getElementById('pvName').textContent = c.short || c.name;
  document.getElementById('pvRole').textContent = c.role || '';

  // Three numbers, in plain words. Anyone who has never played D&D reads
  // "Health / Armour / Speed" faster than "HP / AC / SPD".
  document.getElementById('pvStats').innerHTML = [
    ['Health', s.hp], ['Armour', s.ac], ['Speed', s.speed],
  ].map(([label, val]) => `
    <div class="pv-stat">
      <div class="pv-stat-v">${val}</div>
      <div class="pv-stat-l">${label}</div>
    </div>`).join('');

  paintClaim(id);
}

function paintClaim(id) {
  const claim = getDibs()[id];
  document.getElementById('pvClaim').innerHTML = claim
    ? `<span class="pv-claimed">&#9679; ${claim} has dibs</span>`
    : `<span class="pv-open">&#9675; Open &mdash; call dibs in the group chat</span>`;
}

export function initDetailPanel() {
  document.getElementById('pvGo')
    .addEventListener('click', () => activeId && window.openSheet(activeId));
}
