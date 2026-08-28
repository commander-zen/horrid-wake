import { CHARS } from '../services/characters.js';
import { CHAR_IMGS } from '../services/images.js';
import { openDetail } from './detailPanel.js';

let IMGS = {};

export function buildCards() {
  IMGS = CHAR_IMGS;
  window.IMGS = IMGS;

  const row = document.getElementById('charsRow');
  row.innerHTML = '';
  CHARS.forEach(c => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="card-img" style="background-image:url('${IMGS[c.imgKey] || ''}')"></div>
      <div class="card-fire-light"></div>
      <div class="card-top-fade"></div>
      <div class="card-sides"></div>
      <div class="card-bottom-fade"></div>
      <div class="card-name">${c.short || c.name}</div>
    `;
    card.addEventListener('click', ()=>openDetail(c.id));
    row.appendChild(card);
  });
}
