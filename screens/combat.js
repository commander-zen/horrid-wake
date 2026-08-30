import { CHARS, SHEETS, ACTIONS, COMMON_ACTIONS } from '../services/characters.js';

// ── COMBAT MODE ───────────────────────────────────────────────
// One player, one phone. Nothing here talks to anyone else's device.
//
// The point is that a player who has never touched D&D can take a turn
// without knowing the vocabulary. So the turn is presented as a budget of
// things you get to spend -- Move, Action, Bonus, Reaction -- each of which
// greys out once used, and every ability says in plain words what it does.
// The app rolls and adds; the player narrates.

const SLOTS = [
  { key: 'action',   label: 'Action',   hint: 'The main thing you do' },
  { key: 'bonus',    label: 'Bonus',    hint: 'A quick extra thing, if you have one' },
  { key: 'move',     label: 'Move',     hint: 'Walk, run, climb' },
  { key: 'reaction', label: 'Reaction', hint: "Saved for someone else's turn" },
];

let charId = null;
let used = {};
let hp = 0;

const d = n => 1 + Math.floor(Math.random() * n);

// "1d8+4" -> { rolls:[6], mod:4, total:10 }
function rollDice(expr) {
  const m = String(expr).match(/(\d+)d(\d+)\s*([+-]\s*\d+)?/);
  if (!m) return null;
  const rolls = Array.from({ length: +m[1] }, () => d(+m[2]));
  const mod = m[3] ? parseInt(m[3].replace(/\s/g, ''), 10) : 0;
  return { rolls, mod, total: rolls.reduce((a, b) => a + b, 0) + mod };
}

export function openCombat(id) {
  charId = id;
  used = {};
  hp = SHEETS[id].hp;
  render();
  document.getElementById('combatView').classList.add('open');
}

export function closeCombat() {
  document.getElementById('combatView').classList.remove('open');
}

function endTurn() {
  used = {};
  say('New turn. Everything is available again.');
  render();
}

function say(html) {
  const log = document.getElementById('cbLog');
  log.innerHTML = html;
  log.classList.remove('flash');
  void log.offsetWidth;                 // restart the animation
  log.classList.add('flash');
}

function spend(slot) {
  if (slot === 'free') return true;     // free things never cost the turn
  if (used[slot]) return false;
  used[slot] = true;
  return true;
}

function doAction(a) {
  if (!spend(a.type)) {
    say(`<b>Already used your ${a.type} this turn.</b> End the turn to get it back.`);
    render();
    return;
  }

  const bits = [`<b>${a.name}</b>`];

  if (a.atk) {
    const nat = d(20);
    const bonus = parseInt(String(a.atk).replace(/[^\-0-9]/g, ''), 10) || 0;
    const crit = nat === 20 || (a.note && /19 or 20/.test(a.note) && nat === 19);
    bits.push(
      `<span class="cb-roll">To hit: <b>${nat + bonus}</b></span>` +
      `<span class="cb-sub">(d20 rolled ${nat}${bonus >= 0 ? ' + ' + bonus : ' − ' + Math.abs(bonus)})` +
      `${crit ? ' — <b>CRIT!</b>' : nat === 1 ? ' — <b>fumble</b>' : ''}</span>`
    );
  }

  if (a.dmg) {
    const r = rollDice(a.dmg);
    if (r) {
      bits.push(
        `<span class="cb-roll">Damage: <b>${r.total}</b></span>` +
        `<span class="cb-sub">(${r.rolls.join(' + ')}${r.mod ? ' + ' + r.mod : ''})</span>`
      );
    } else {
      bits.push(`<span class="cb-sub">${a.dmg}</span>`);
    }
  }

  if (!a.atk && !a.dmg) bits.push(`<span class="cb-sub">${a.why}</span>`);
  if (a.note) bits.push(`<span class="cb-sub">${a.note}</span>`);

  say(bits.join(''));
  render();
}

function adjustHp(delta) {
  const max = SHEETS[charId].hp;
  hp = Math.max(0, Math.min(max, hp + delta));
  say(hp === 0
    ? "<b>You're down.</b> Roll a death save when the DM says so."
    : `Health now <b>${hp}</b> of ${max}.`);
  render();
}

function render() {
  const c = CHARS.find(x => x.id === charId);
  const s = SHEETS[charId];
  const list = [...(ACTIONS[charId] || []), ...COMMON_ACTIONS];

  document.getElementById('cbName').textContent = c.short || c.name;
  document.getElementById('cbHp').textContent = `${hp} / ${s.hp}`;
  document.getElementById('cbHpBar').style.width = `${(hp / s.hp) * 100}%`;

  document.getElementById('cbSlots').innerHTML = SLOTS.map(sl => `
    <div class="cb-slot${used[sl.key] ? ' spent' : ''}">
      <div class="cb-slot-l">${sl.label}</div>
      <div class="cb-slot-s">${used[sl.key] ? 'used' : sl.hint}</div>
    </div>`).join('');

  const group = (key, label, blurb) => {
    const items = list.filter(a => a.type === key);
    if (!items.length) return '';
    return `
      <div class="cb-group">
        <div class="cb-group-h">${label}<span>${blurb}</span></div>
        ${items.map(a => `
          <button class="cb-act${used[key] && key !== 'free' ? ' spent' : ''}"
                  data-name="${a.name}" type="button">
            <div class="cb-act-top">
              <span class="cb-act-n">${a.name}</span>
              ${a.atk ? `<span class="cb-act-x">${a.atk}</span>` : ''}
              ${a.dmg && !a.atk ? `<span class="cb-act-x">${a.dmg}</span>` : ''}
            </div>
            <div class="cb-act-w">${a.why}</div>
            ${a.uses ? `<div class="cb-act-u">${a.uses}</div>` : ''}
          </button>`).join('')}
      </div>`;
  };

  document.getElementById('cbActs').innerHTML =
    group('action',   'ACTION',   'one per turn') +
    group('bonus',    'BONUS',    'one per turn, quick') +
    group('free',     'FREE',     'costs you nothing') +
    group('move',     'MOVE',     `up to ${s.speed} feet`) +
    group('reaction', 'REACTION', "on someone else's turn");

  document.querySelectorAll('.cb-act').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = list.find(x => x.name === btn.dataset.name);
      if (a) doAction(a);
    });
  });
}

export function initCombat() {
  document.getElementById('cbClose').addEventListener('click', closeCombat);
  document.getElementById('cbEnd').addEventListener('click', endTurn);
  document.getElementById('cbHurt').addEventListener('click', () => adjustHp(-1));
  document.getElementById('cbHeal').addEventListener('click', () => adjustHp(+1));
  window.openCombat = openCombat;
}
