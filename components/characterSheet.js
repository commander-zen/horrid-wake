import { CHARS, SHEETS, PRIMARY_STAT } from '../services/characters.js';

// ── SHEET VIEW ────────────────────────────────────────────────
// Renders a single level-5 The Lord of the Rings Roleplaying sheet.
// The LEVEL 1 / LEVEL 5 toggle is gone: this is a one-shot at 5th, and every
// old level1 block was a byte-for-byte copy of its level5 twin, so the control
// only implied a progression that doesn't exist.

let sheetCharId = null;

export function openSheet(id) {
  sheetCharId = id;
  const c = CHARS.find(x => x.id === id);
  document.getElementById('shHeroImg').style.backgroundImage = `url('${window.IMGS[c.imgKey] || ''}')`;
  renderSheet();
  document.getElementById('sheetView').classList.add('open');
}

export function closeSheet() {
  document.getElementById('sheetView').classList.remove('open');
}

const mod = v => { const m = Math.floor((v - 10) / 2); return (m >= 0 ? '+' : '') + m; };

function renderSheet() {
  const c = CHARS.find(x => x.id === sheetCharId);
  const s = SHEETS[sheetCharId];
  const primary = PRIMARY_STAT[sheetCharId];

  document.getElementById('shCharName').textContent = c.name;
  document.getElementById('shClassLine').innerHTML =
    `${s.culture} &middot; ${s.calling}${s.path ? ' (' + s.path + ')' : ''}` +
    `<span class="sh-lvl-badge">LVL 5</span>`;

  const stats = [
    { key: 'str', label: 'STR', val: s.str }, { key: 'dex', label: 'DEX', val: s.dex },
    { key: 'con', label: 'CON', val: s.con }, { key: 'int', label: 'INT', val: s.int },
    { key: 'wis', label: 'WIS', val: s.wis }, { key: 'cha', label: 'CHA', val: s.cha },
  ];

  // Shadow thresholds are pure functions of Wisdom: miserable at half your WIS
  // rounded up, anguished at the full score, which is also the hard cap.
  const miserable = Math.ceil(s.wis / 2);
  const anguished = s.wis;
  const pips = Array.from({ length: anguished }, (_, i) => {
    const cls = i + 1 >= anguished ? 'anguish' : (i + 1 >= miserable ? 'misery' : '');
    return `<span class="sh-pip ${cls}"></span>`;
  }).join('');

  const list = (label, arr) => arr && arr.length ? `
    <div class="sh-section">
      <div class="sh-section-title">${label}</div>
      ${arr.map(x => `<div class="sh-feature">&#9670; ${x}</div>`).join('')}
    </div>` : '';

  document.getElementById('shBody').innerHTML = `
    <div class="sh-vitals">
      <div class="sh-vital"><div class="sh-vital-v" style="color:#65c040">${s.hp}</div><div class="sh-vital-l">HP</div></div>
      <div class="sh-vital"><div class="sh-vital-v" style="color:#3d8fd4">${s.ac}</div><div class="sh-vital-l">AC</div></div>
      <div class="sh-vital"><div class="sh-vital-v" style="color:var(--gold)">${s.speed}</div><div class="sh-vital-l">Speed</div></div>
      <div class="sh-vital"><div class="sh-vital-v" style="color:var(--gold)">+${s.prof}</div><div class="sh-vital-l">Prof</div></div>
    </div>

    <div class="sh-section">
      <div class="sh-section-title">Ability Scores</div>
      <div class="sh-ability-grid">
        ${stats.map(({ key, label, val }) => `
          <div class="sh-ability${key === primary ? ' primary' : ''}${s.saves.includes(key) ? ' saved' : ''}">
            <div class="sh-ability-label">${label}</div>
            <div class="sh-ability-score">${val}</div>
            <div class="sh-ability-mod">${mod(val)}</div>
          </div>`).join('')}
      </div>
      <div class="sh-note">Saving-throw proficiencies: ${s.saves.map(x => x.toUpperCase()).join(', ')}.</div>
    </div>

    <div class="sh-section">
      <div class="sh-section-title">Shadow &mdash; ${s.shadowPath}</div>
      <div class="sh-shadow">${pips}</div>
      <div class="sh-note">
        Miserable at ${miserable}, anguished at ${anguished} (your Wisdom score).
        Miserable costs the Company 1 Fellowship and turns a rolled 1 or 2 into a
        failure; anguished adds disadvantage on everything until a bout of madness.
      </div>
    </div>

    <div class="sh-section">
      <div class="sh-section-title">Skills</div>
      <div class="sh-skills">
        ${Object.entries(s.skills).map(([name, val]) => `
          <div class="sh-skill">
            <span class="sh-skill-name">${name}</span>
            <span class="sh-skill-val">${val >= 0 ? '+' : ''}${val}</span>
          </div>`).join('')}
      </div>
    </div>

    ${list('Virtues', s.virtues)}
    ${list('Rewards', s.rewards)}
    ${list('Features &amp; Traits', s.features)}

    <div class="sh-section">
      <div class="sh-section-title">Equipment</div>
      ${s.equipment.map(e => `<div class="sh-equip">${e}</div>`).join('')}
    </div>

    <div class="sh-section">
      <div class="sh-section-title">Background &mdash; ${s.background}</div>
      <div class="sh-skill"><span class="sh-skill-name">Distinctive Features</span><span class="sh-skill-val">${s.distinctive.join(', ')}</span></div>
      <div class="sh-skill"><span class="sh-skill-name">Standard of Living</span><span class="sh-skill-val">${s.standard}</span></div>
      <div class="sh-skill"><span class="sh-skill-name">Size</span><span class="sh-skill-val">${s.size}</span></div>
      <div class="sh-skill"><span class="sh-skill-name">Hit Die</span><span class="sh-skill-val">${s.hitDie}</span></div>
      <div class="sh-skill"><span class="sh-skill-name">Languages</span><span class="sh-skill-val">${s.languages.join(', ')}</span></div>
    </div>
  `;
}

// ── INIT: expose globals needed by inline HTML onclick handlers ──
export function initCharacterSheet() {
  window.openSheet  = openSheet;
  window.closeSheet = closeSheet;
}
