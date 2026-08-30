import { CHARS, SHEETS, KNOWN_DIBS } from '../services/characters.js';
import { resolveArt } from '../services/images.js';

// Live preview panel. This used to be a full-screen detail sheet you
// navigated to and back out of; it is now a fixed panel under the roster grid
// that simply re-renders when a cell is tapped. Nothing slides, nothing
// covers the roster, and the whole cast stays visible while you compare.
//
// DIBS: claims made in-app live in localStorage, which is per-device. A claim
// made on Ben's phone is invisible on everyone else's. Genuinely shared dibs
// needs a backend, and we deleted the Firebase stack three commits ago -- so
// pre-known claims are seeded from KNOWN_DIBS in characters.js instead.

const DIBS_KEY = 'hw-dibs';

const readDibs = () => {
  try { return { ...KNOWN_DIBS, ...JSON.parse(localStorage.getItem(DIBS_KEY) || '{}') }; }
  catch { return { ...KNOWN_DIBS }; }
};

const writeDibs = (map) => {
  const own = { ...map };
  for (const k of Object.keys(KNOWN_DIBS)) delete own[k];   // don't persist seeds
  try { localStorage.setItem(DIBS_KEY, JSON.stringify(own)); } catch {}
};

export function getDibs() { return readDibs(); }

let activeId = null;

export function getActiveId() { return activeId; }

export function showPreview(id) {
  activeId = id;
  window.activeId = id;

  const c = CHARS.find(x => x.id === id);
  const s = SHEETS[id];

  document.getElementById('pvEmpty').hidden = true;
  document.getElementById('pvBody').hidden = false;

  const em = document.getElementById('pvEmblem');
  em.classList.add('is-emblem');
  resolveArt(c.id, window.IMGS[c.imgKey] || '', (src, isEmblem) => {
    if (activeId !== id) return;              // a faster tap already won
    em.style.backgroundImage = `url('${src}')`;
    em.classList.toggle('is-emblem', isEmblem);
  });
  document.getElementById('pvName').textContent = c.short || c.name;
  document.getElementById('pvCls').textContent = c.cls;
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
  const claim = readDibs()[id];
  const line = document.getElementById('pvClaim');
  const btn  = document.getElementById('pvDibs');

  if (claim) {
    line.innerHTML = `<span class="pv-claimed">${claim} has dibs</span>`;
    btn.textContent = 'RELEASE';
    btn.classList.add('taken');
  } else {
    line.innerHTML = '';
    btn.textContent = 'DIBS';
    btn.classList.remove('taken');
  }
}

function toggleDibs() {
  if (!activeId) return;
  const map = readDibs();

  if (map[activeId]) {
    if (KNOWN_DIBS[activeId]) {
      document.getElementById('pvClaim').innerHTML =
        `<span class="pv-claimed">${KNOWN_DIBS[activeId]} called this one before the app existed. Talk to them.</span>`;
      return;
    }
    delete map[activeId];
    writeDibs(map);
    paintClaim(activeId);
    window.refreshRoster?.();
    return;
  }

  // inline name entry, so nobody meets a browser prompt() dialog
  const line = document.getElementById('pvClaim');
  line.innerHTML = `
    <form class="pv-namer" id="pvNamer">
      <input id="pvNameIn" type="text" maxlength="18" autocomplete="off"
             placeholder="your name" aria-label="Your name">
      <button type="submit">OK</button>
    </form>`;
  const input = document.getElementById('pvNameIn');
  input.focus();

  document.getElementById('pvNamer').addEventListener('submit', (e) => {
    e.preventDefault();
    const who = input.value.trim();
    if (!who) return;
    const m = readDibs();
    m[activeId] = who;
    writeDibs(m);
    paintClaim(activeId);
    window.refreshRoster?.();
  });
}

export function initDetailPanel() {
  document.getElementById('pvGo')
    .addEventListener('click', () => activeId && window.openSheet(activeId));
  document.getElementById('pvDibs')
    .addEventListener('click', toggleDibs);
}
