import { CHARS } from '../services/characters.js';
import { CHAR_IMGS } from '../services/images.js';
import { showPreview } from './detailPanel.js';

// Fighting-game roster grid. The whole cast sits on screen at once -- eight
// characters is exactly 4x2, which fits a 375px phone with no scrolling.
// Tapping a cell updates the preview panel below; it never navigates, so
// finding out who someone is costs one tap and zero screen changes.

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
      <div class="cell-art" style="background-image:url('${IMGS[c.imgKey] || ''}')"></div>
      <div class="cell-name">${c.short || c.name}</div>
    `;
    cell.addEventListener('click', () => select(c.id));
    grid.appendChild(cell);
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
