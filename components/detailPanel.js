import { CHARS } from '../services/characters.js';
import { openSummerCamp } from '../screens/summerCamp.js';

const BIO = {
  dennis:  "Chaotic magic user who bends minds and bends luck.",
  mac:     "Holy warrior built to absorb punishment and dish it back.",
  charlie: "Nature's wrath channeled through rot and regrowth.",
  dee:     "Silver-tongued manipulator who wins fights before they start.",
  frank:   "Feral berserker who gets more dangerous the more he bleeds.",
};

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
  document.getElementById('dTag').textContent = BIO[c.id] || '';
  document.getElementById('dIdentity').innerHTML = '';

  document.getElementById('detailPanel').classList.add('open');
}

export function closeDetail() {
  activeId = null;
  window.activeId = null;
  document.getElementById('detailPanel').classList.remove('open');
  document.querySelectorAll('.char-card').forEach(el=>el.classList.remove('dimmed'));
  document.getElementById('tapHint').style.opacity='';
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
  window.openSummerCamp = openSummerCamp;
  window.enterGroupChat = enterGroupChat;
}
