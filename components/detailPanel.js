import { CHARS, IDENTITY } from '../services/characters.js';
import { openSheet, openSummerCamp } from '../screens/summerCamp.js';

let activeId = null;

export function getActiveId() { return activeId; }

export function openDetail(id) {
  activeId = id;
  window.activeId = id;

  const c = CHARS.find(x=>x.id===id);

  document.querySelectorAll('.char-card').forEach(el=>{
    el.classList.toggle('dimmed', el.dataset.id!==id);
  });
  document.getElementById('tapHint').style.opacity='0';

  const heroImg = document.getElementById('dHeroImg');
  heroImg.style.backgroundImage = `url('${window.IMGS[c.imgKey] || ''}')`;
  heroImg.style.backgroundPosition = 'center center';

  document.getElementById('dName').textContent = c.name;
  document.getElementById('dCls').textContent = c.cls;
  document.getElementById('dTag').textContent = c.tag;

  const ident = IDENTITY[c.id];
  document.getElementById('dIdentity').innerHTML = `
    <div class="d-identity-row">
      <div class="d-identity-label">${ident.doesLabel}</div>
      <div class="d-identity-text">${ident.does}</div>
    </div>
    <div class="d-identity-spacer"></div>
    <div class="d-identity-row">
      <div class="d-identity-label">FOR THE PLAYER WHO:</div>
      <div class="d-identity-text">${ident.forPlayer}</div>
    </div>
  `;

  document.getElementById('detailPanel').classList.add('open');
}

export function closeDetail() {
  activeId = null;
  window.activeId = null;
  document.getElementById('detailPanel').classList.remove('open');
  document.querySelectorAll('.char-card').forEach(el=>el.classList.remove('dimmed'));
  document.getElementById('tapHint').style.opacity='';
}

export function enterDungeon() {
  const nameEl = document.getElementById('dName');
  const c = CHARS.find(x=>x.id===activeId);
  if(c) c.name = nameEl.textContent.trim();
  openSheet(activeId);
}

export function enterGroupChat() {
  const nameEl = document.getElementById('dName');
  const c = CHARS.find(x=>x.id===activeId);
  if (!c) return;

  const characterName = nameEl.textContent.trim() || c.name;

  let playerId = localStorage.getItem('horrid-wake-pid');
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem('horrid-wake-pid', playerId);
  }

  localStorage.setItem('horrid-wake-player', JSON.stringify({
    playerId,
    characterId:   c.id,
    characterName,
    portraitKey:   c.imgKey
  }));

  window.location.href = 'chat.html';
}

export function initDetailPanel() {
  window.closeDetail    = closeDetail;
  window.enterDungeon   = enterDungeon;
  window.openSummerCamp = openSummerCamp;
  window.enterGroupChat = enterGroupChat;
}
