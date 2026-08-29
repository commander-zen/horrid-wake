import { CHARS } from '../services/characters.js';

const BIO = {
  frodo:   "Ring-bearer. Carrying the thing everyone else is trying not to look at.",
  sam:     "Gardener, cook, and the most stubborn loyalty in Middle-earth.",
  aragorn: "Ranger and rightful king, currently very busy not talking about it.",
  legolas: "Elven archer who has never missed and will remind you of that.",
  gimli:   "Dwarven berserker settling a centuries-old grudge one axe swing at a time.",
  boromir: "Gondor's finest, holding the line against everything — including himself.",
  merry:   "Halfling rogue nobody sees coming, on purpose.",
  pippin:  "Bard, guard, and full-time reason things get complicated.",
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

  const nameEl = document.getElementById('dName');
  nameEl.textContent = c.name;
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

export function initDetailPanel() {
  window.closeDetail = closeDetail;
}
