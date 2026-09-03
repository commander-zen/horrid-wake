import { CHARS } from '../services/characters.js';
import { CHAR_IMGS, resolveArt } from '../services/images.js';
import { showPreview, getDibs } from './detailPanel.js';

// Fighting-game roster grid: 2 across by 4 down, filling whatever height is
// left after the title and preview, so the whole cast is visible at once with
// no scrolling. Tapping a cell updates the preview panel below; it never
// navigates, so finding out who someone is costs one tap and zero screens.
//
// Each cell shows character art from images/<id>.<ext> if present, and falls
// back to the gold-line emblem otherwise.

let IMGS = {};

export function buildCards() {
  IMGS = CHAR_IMGS;
  window.IMGS = IMGS;

  const grid = document.getElementById('roster');
  grid.innerHTML = '';

  CHARS.forEach(c => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.id = c.id;
    cell.setAttribute('role', 'option');
    cell.setAttribute('aria-selected', 'false');
    cell.innerHTML = `
      <img class="cell-art is-emblem" alt="">
      <div class="cell-dibs"></div>
      <div class="cell-name">${c.short || c.name}</div>
    `;

    const art = cell.querySelector('.cell-art');
    resolveArt(c.id, IMGS[c.imgKey] || '', (src, isEmblem) => {
      art.src = src;
      art.classList.toggle('is-emblem', isEmblem);
    });

    cell.addEventListener('click', () => select(c.id));
    grid.appendChild(cell);
  });

  paintDibs();
  window.refreshRoster = paintDibs;

  // Select someone immediately. The preview panel is a fixed height, so
  // leaving it empty on load wasted ~300px on a placeholder -- nearly half
  // the screen on a tall phone. Now it always shows a character.
  if (CHARS.length) select(CHARS[0].id);
}

// Claimed characters are marked on the grid itself, so nobody has to tap
// through eight cells to find out who is already spoken for.
function paintDibs() {
  const claims = getDibs();
  document.querySelectorAll('.cell').forEach(el => {
    const who = claims[el.dataset.id];
    el.classList.toggle('claimed', !!who);
    el.querySelector('.cell-dibs').textContent = who || '';
  });
}

function select(id) {
  document.querySelectorAll('.cell').forEach(el => {
    const on = el.dataset.id === id;
    el.classList.toggle('sel', on);
    el.setAttribute('aria-selected', String(on));
  });
  showPreview(id);
}
