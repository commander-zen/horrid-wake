import { CHARS, SHEETS, PRIMARY_STAT } from '../services/characters.js';

// ── SHEET VIEW ────────────────────────────────────────────────
let sheetCharId = null;
let sheetLevel = 5;

export function openSheet(id) {
  sheetCharId = id;
  sheetLevel = 5;
  document.getElementById('shLvl1').classList.remove('active');
  document.getElementById('shLvl5').classList.add('active');
  const c = CHARS.find(x=>x.id===id);
  document.getElementById('shHeroImg').style.backgroundImage = `url('${window.IMGS[c.imgKey]||''}')`;
  renderSheet();
  document.getElementById('sheetView').classList.add('open');
}

export function closeSheet() {
  document.getElementById('sheetView').classList.remove('open');
}

export function setSheetLevel(lvl) {
  sheetLevel = lvl;
  document.getElementById('shLvl1').classList.toggle('active', lvl===1);
  document.getElementById('shLvl5').classList.toggle('active', lvl===5);
  renderSheet();
}

function renderSheet() {
  const c = CHARS.find(x=>x.id===sheetCharId);
  const s = SHEETS[sheetCharId][sheetLevel===1?'level1':'level5'];
  const primary = PRIMARY_STAT[sheetCharId];
  const mod = v=>{ const m=Math.floor((v-10)/2); return(m>=0?'+':'')+m; };

  document.getElementById('shCharName').textContent = c.name;
  document.getElementById('shClassLine').innerHTML =
    `${s.class}${s.subclass?' &middot; '+s.subclass:''}`+
    `<span class="sh-lvl-badge">LVL ${sheetLevel}</span>`;

  const stats = [
    {key:'str',label:'STR',val:s.str},{key:'dex',label:'DEX',val:s.dex},
    {key:'con',label:'CON',val:s.con},{key:'int',label:'INT',val:s.int},
    {key:'wis',label:'WIS',val:s.wis},{key:'cha',label:'CHA',val:s.cha},
  ];

  const hasSpells = (s.cantrips&&s.cantrips.length)||(s.spells_1&&s.spells_1.length)||(s.spells_2&&s.spells_2.length);

  const spellGroup = (label, arr) => arr&&arr.length ? `
    <div class="sh-spell-group">
      <div class="sh-spell-group-label">${label}</div>
      <div class="sh-spell-list">${arr.map(sp=>`<div class="sh-spell">${sp}</div>`).join('')}</div>
    </div>` : '';

  const spellsSection = hasSpells ? `
    <div class="sh-section">
      <div class="sh-section-title">Spells</div>
      ${spellGroup('Cantrips', s.cantrips)}
      ${spellGroup('1st Level', s.spells_1)}
      ${spellGroup('2nd Level', s.spells_2)}
    </div>` : '';

  document.getElementById('shBody').innerHTML = `
    <div class="sh-vitals">
      <div class="sh-vital"><div class="sh-vital-v" style="color:#65c040">${s.hp}</div><div class="sh-vital-l">HP</div></div>
      <div class="sh-vital"><div class="sh-vital-v" style="color:#3d8fd4">${s.ac}</div><div class="sh-vital-l">AC</div></div>
      <div class="sh-vital"><div class="sh-vital-v" style="color:var(--gold)">${s.speed}</div><div class="sh-vital-l">Speed</div></div>
    </div>
    <div class="sh-section">
      <div class="sh-section-title">Ability Scores</div>
      <div class="sh-ability-grid">
        ${stats.map(({key,label,val})=>`
          <div class="sh-ability${key===primary?' primary':''}">
            <div class="sh-ability-label">${label}</div>
            <div class="sh-ability-score">${val}</div>
            <div class="sh-ability-mod">${mod(val)}</div>
          </div>`).join('')}
      </div>
    </div>
    <div class="sh-section">
      <div class="sh-section-title">Skills</div>
      <div class="sh-skills">
        ${Object.entries(s.skills).map(([name,val])=>`
          <div class="sh-skill">
            <span class="sh-skill-name">${name}</span>
            <span class="sh-skill-val">${val>=0?'+':''}${val}</span>
          </div>`).join('')}
      </div>
    </div>
    ${spellsSection}
    ${s.features&&s.features.length?`
    <div class="sh-section">
      <div class="sh-section-title">${hasSpells?'Features &amp; Traits':'Combat Features'}</div>
      ${s.features.map(f=>`<div class="sh-feature">&#9670; ${f}</div>`).join('')}
    </div>`:''}
    <div class="sh-section">
      <div class="sh-section-title">Equipment</div>
      ${s.equipment.map(e=>`<div class="sh-equip">${e}</div>`).join('')}
    </div>
  `;
}

// ── INIT: expose globals needed by inline HTML onclick handlers ──
export function initCharacterSheet() {
  window.openSheet     = openSheet;
  window.closeSheet    = closeSheet;
  window.setSheetLevel = setSheetLevel;
}
