import { CHARS, SHEETS, PRIMARY_STAT, ACTIONS, COMMON_ACTIONS } from '../services/characters.js';
import { resolveArt } from '../services/images.js';

// ── SHEET VIEW ────────────────────────────────────────────────
// Renders a single level-5 The Lord of the Rings Roleplaying sheet.
// The LEVEL 1 / LEVEL 5 toggle is gone: this is a one-shot at 5th, and every
// old level1 block was a byte-for-byte copy of its level5 twin, so the control
// only implied a progression that doesn't exist.

let sheetCharId = null;

export function openSheet(id) {
  sheetCharId = id;
  const c = CHARS.find(x => x.id === id);
  const hero = document.getElementById('shHeroImg');
  resolveArt(c.id, window.IMGS[c.imgKey] || '', (src, isEmblem) => {
    if (sheetCharId !== id) return;
    hero.style.backgroundImage = `url('${src}')`;
    hero.classList.toggle('is-emblem', isEmblem);
  });
  renderSheet();
  document.getElementById('sheetView').classList.add('open');
}

export function closeSheet() {
  document.getElementById('sheetView').classList.remove('open');
}

const esc = t => String(t).replace(/"/g, '&quot;');
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

  // Progressive disclosure. What a player needs mid-fight stays open at the
  // top; reference material collapses behind a tap. Native <details> keeps it
  // keyboard- and screen-reader-accessible with no JS.
  const acc = (label, inner, open) => inner ? `
    <details class="sh-acc"${open ? ' open' : ''}>
      <summary>${label}</summary>
      <div class="sh-acc-body">${inner}</div>
    </details>` : '';

  const diamonds = arr => (arr && arr.length)
    ? arr.map(x => `<div class="sh-feature" data-ex="item" data-t="${esc(x)}">${x}</div>`).join('') : '';

  const rows = pairs => pairs
    .map(([k, v, ex]) => `<div class="sh-skill" data-ex="bg" data-t="${esc(ex)}"><span class="sh-skill-name">${k}</span><span class="sh-skill-val">${v}</span></div>`)
    .join('');

  document.getElementById('shBody').innerHTML = `
    <div class="sh-primary">
    <div class="sh-vitals">
      <div class="sh-vital" data-ex="vital" data-t="hp"><div class="sh-vital-v" style="color:#65c040">${s.hp}</div><div class="sh-vital-l">HP</div></div>
      <div class="sh-vital" data-ex="vital" data-t="ac"><div class="sh-vital-v">${s.ac}</div><div class="sh-vital-l">AC</div></div>
      <div class="sh-vital" data-ex="vital" data-t="speed"><div class="sh-vital-v">${s.speed}</div><div class="sh-vital-l">Speed</div></div>
      <div class="sh-vital" data-ex="vital" data-t="prof"><div class="sh-vital-v">+${s.prof}</div><div class="sh-vital-l">Prof</div></div>
    </div>

    <div class="sh-section">
      <div class="sh-section-title">Ability Scores</div>
      <div class="sh-ability-grid">
        ${stats.map(({ key, label, val }) => `
          <div class="sh-ability${key === primary ? ' primary' : ''}" data-ex="abil" data-t="${key}">
            <div class="sh-ability-label">${label}</div>
            <div class="sh-ability-mod">${mod(val)}</div>
            <div class="sh-ability-score">${val}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="sh-primary">
      <div class="sh-section-title">Saving Throws</div>
      <div class="sh-saves">
        ${stats.map(({ key, label, val }) => {
          const prof = s.saves.includes(key);
          const total = Math.floor((val - 10) / 2) + (prof ? s.prof : 0);
          return `
          <div class="sh-save${prof ? ' on' : ''}" data-ex="save" data-t="${key}">
            <span class="sh-save-dot"></span>
            <span class="sh-save-n">${label}</span>
            <span class="sh-save-v">${total >= 0 ? '+' : ''}${total}</span>
          </div>`;
        }).join('')}
      </div>
      <div class="sh-note">A filled dot means you are trained in that save &mdash; your proficiency bonus of +${s.prof} is already included.</div>

      <div class="sh-section-title" style="margin-top:14px">Shadow &mdash; ${s.shadowPath}</div>
      <div class="sh-shadow" data-ex="shadow" data-t="${esc(s.shadowPath)}">${pips}</div>
      <div class="sh-note">
        Miserable at ${miserable}, anguished at ${anguished} (your Wisdom score).
        Miserable costs the Company 1 Fellowship and turns a rolled 1 or 2 into a
        failure; anguished adds disadvantage on everything until a bout of madness.
      </div>
    </div>

    ${acc('Features &amp; Traits', diamonds(s.features), true)}

    ${acc('Skills', `<div class="sh-skills">${
      Object.entries(s.skills).map(([name, val]) => `
        <div class="sh-skill" data-ex="skill" data-t="${esc(name)}">
          <span class="sh-skill-name">${name}</span>
          <span class="sh-skill-val">${val >= 0 ? '+' : ''}${val}</span>
        </div>`).join('')}</div>`)}

    ${acc('Virtues &amp; Rewards', diamonds([...s.virtues, ...s.rewards]))}

    ${acc('Equipment',
        s.equipment.map(e => `<div class="sh-equip" data-ex="item" data-t="${esc(e)}">${e}</div>`).join(''))}

    ${acc(`Background &mdash; ${s.background}`, rows([
        ['Distinctive Features', s.distinctive.join(', '), 'features'],
        ['Standard of Living',   s.standard,               'living'],
        ['Size',                 s.size,                   'size'],
        ['Hit Die',              s.hitDie,                 'hitdie'],
        ['Languages',            s.languages.join(', '),   'langs'],
      ]))}
  `;
}

// ── TAP TO EXPLAIN ────────────────────────────────────────────
// Every number on this sheet is tappable. Half the party has never played,
// and a sheet full of unexplained abbreviations is exactly where they stall.
// Written for someone who does not know what a d20 is.

const ABIL = {
  str: ['Strength', 'Raw muscle. Swinging heavy weapons, shoving, climbing, hauling things.'],
  dex: ['Dexterity', 'Speed and precision. Dodging, sneaking, shooting a bow, acting early in a fight.'],
  con: ['Constitution', 'Toughness. How much punishment you soak, and whether you stay standing.'],
  int: ['Intelligence', 'Book smarts. Old lore, riddles, puzzles, spotting something forged.'],
  wis: ['Wisdom', 'Reading the room and the road. Noticing things, tracking, resisting the Shadow.'],
  cha: ['Charisma', 'Force of personality. Persuading, lying, leading, performing.'],
};

const VITAL = {
  hp:    ['Hit Points', 'How much damage you can take before you go down. It drops as you get hit and comes back when you rest or someone heals you.'],
  ac:    ['Armour Class', 'How hard you are to hit. Someone attacking you rolls a d20 and needs this number or higher to land it.'],
  speed: ['Speed', 'How far you can move on your turn, in feet. Roughly one big stride per 5 feet.'],
  prof:  ['Proficiency Bonus', 'Your training bonus. It is already added into anything you are trained in, so you do not need to add it yourself.'],
};

const BG = {
  features: ['Distinctive Features',
    'Two words that sum up how your character carries themselves. They are not a rule you have to obey &mdash; they are a hint for playing them. Lean into them at the table and the DM may hand you Inspiration for it.'],
  living: ['Standard of Living',
    'How comfortable your folk are. It decided what kit you started with and what you can afford without anyone counting coins. Frugal is not poor; it means your people do not measure worth in gold.'],
  size: ['Size',
    'Small or Medium. Small folk &mdash; hobbits and the like &mdash; can move straight through the space a bigger creature is standing in, which is more useful in a fight than it sounds.'],
  hitdie: ['Hit Die',
    'The die you roll to heal yourself when the party takes a short rest. A d10 heals more than a d8, which is why the sturdier callings get one.'],
  langs: ['Languages',
    "What you can speak, read and write. Westron is the common tongue everyone shares; anything else belongs to your own folk, and is occasionally the only reason a conversation goes anywhere."],
};

function explain(kind, key, sheet) {
  if (kind === 'bg') { const [n, w] = BG[key] || ['', '']; return [n, w]; }
  if (kind === 'abil') {
    const [name, what] = ABIL[key] || ['', ''];
    return [name, `${what}<br><br><b>The big number is your modifier</b> &mdash; add it to any roll using ${name}. The small number underneath is the raw score it comes from; you rarely need it.`];
  }
  if (kind === 'vital') { const [n, w] = VITAL[key] || ['', '']; return [n, w]; }
  if (kind === 'save') {
    const [name] = ABIL[key] || [key];
    const trained = sheet.saves.includes(key);
    return ['Saving Throw: ' + name,
      `A saving throw is a roll to <i>avoid</i> something happening to you &mdash; diving clear of a trap, shrugging off fear, resisting poison.<br><br>` +
      (trained
        ? `You are <b>trained</b> in this one, so your +${sheet.prof} proficiency is already included in the number shown.`
        : `You are not trained in this one, so the number is just your ${name} modifier.`) +
      `<br><br>Roll a d20, add the number, and tell the DM the total.`];
  }
  if (kind === 'skill') {
    return [key, `When you try something using ${key}, roll a d20 and add this number. The DM says whether it worked.<br><br>Everything you are trained in already has your proficiency bonus baked in.`];
  }
  if (kind === 'shadow') {
    return ['Shadow: ' + key,
      `Shadow is the toll that fear, grief and doing ugly things take on you. Each diamond is one point.<br><br>` +
      `Fill the amber ones and you are <b>miserable</b>: the Company loses a point of Fellowship, and a rolled 1 or 2 fails no matter what.<br><br>` +
      `Reach the red one and you are <b>anguished</b>: disadvantage on everything until your character snaps and does something they regret.<br><br>` +
      `<i>${key}</i> is the particular way your character goes wrong when it gets that far.`];
  }
  if (kind === 'item') {
    const act = (window.__ACTIONS || []).find(a => key.toLowerCase().includes(a.name.toLowerCase()));
    if (act && act.why) return [act.name, act.why + (act.atk ? `<br><br>To hit: <b>${act.atk}</b>${act.dmg ? ` &nbsp;·&nbsp; Damage: <b>${act.dmg}</b>` : ''}` : '')];
    return [key, 'Part of your kit or your training. If it matters this round, tap MY TURN &mdash; anything you can actually do on a turn is listed there with the dice already worked out. Otherwise ask the DM.'];
  }
  return [key, ''];
}

function openExplain(kind, key) {
  const s = SHEETS[sheetCharId];
  const [title, bodyHtml] = explain(kind, key, s);
  if (!title) return;
  document.getElementById('exTitle').textContent = title;
  document.getElementById('exBody').innerHTML = bodyHtml;
  document.getElementById('explainView').classList.add('open');
}

// ── INIT: expose globals needed by inline HTML onclick handlers ──
export function initCharacterSheet() {
  window.openSheet  = openSheet;
  window.closeSheet = closeSheet;

  window.__ACTIONS = Object.values(ACTIONS).flat().concat(COMMON_ACTIONS);

  // one delegated listener rather than one per element, since the sheet
  // re-renders whenever a different character is opened
  document.getElementById('shBody').addEventListener('click', (e) => {
    const el = e.target.closest('[data-ex]');
    if (!el) return;
    openExplain(el.dataset.ex, el.dataset.t);
  });

  const close = () => document.getElementById('explainView').classList.remove('open');
  document.getElementById('exClose').addEventListener('click', close);
  document.getElementById('exBackdrop').addEventListener('click', close);
}
