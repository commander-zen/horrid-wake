import { CHARS, SHEETS, PRIMARY_STAT } from '../services/characters.js';
import { buildSystemPrompt, callChatApi } from '../services/groq.js';

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

// ── SUMMER CAMP VIEW ──────────────────────────────────────────
let scCharId = null;

export function openSummerCamp(id) {
  scCharId = id;
  const c = CHARS.find(x=>x.id===id);
  document.getElementById('scHeroImg').style.backgroundImage = `url('${window.IMGS[c.imgKey]||''}')`;
  document.getElementById('scTopName').textContent = c.name;
  renderSummerCamp();
  document.getElementById('summerCampView').classList.add('open');
}

export function closeSummerCamp() {
  document.getElementById('summerCampView').classList.remove('open');
}

function renderSummerCamp() {
  const c = CHARS.find(x=>x.id===scCharId);
  const s = SHEETS[scCharId].level1;
  const primary = PRIMARY_STAT[scCharId];
  const mod = v=>{ const m=Math.floor((v-10)/2); return(m>=0?'+':'')+m; };
  const stats = [
    {key:'str',label:'STR',val:s.str},{key:'dex',label:'DEX',val:s.dex},
    {key:'con',label:'CON',val:s.con},{key:'int',label:'INT',val:s.int},
    {key:'wis',label:'WIS',val:s.wis},{key:'cha',label:'CHA',val:s.cha},
  ];
  document.getElementById('scBody').innerHTML = `
    <p class="sc-flavor">The road to Phandelver is long and the nights are cold. Your story begins here — Level 1, broke, and already in over your head. Adventure with the gang through Lost Mines of Phandelver this summer, and arrive at the table battle-hardened and ready.</p>
    <div class="sc-section">
      <div class="sc-section-title">Character Snapshot &middot; Level 1</div>
      <div class="sh-vitals">
        <div class="sh-vital"><div class="sh-vital-v" style="color:#65c040">${s.hp}</div><div class="sh-vital-l">HP</div></div>
        <div class="sh-vital"><div class="sh-vital-v" style="color:#3d8fd4">${s.ac}</div><div class="sh-vital-l">AC</div></div>
        <div class="sh-vital"><div class="sh-vital-v" style="color:var(--gold)">${s.speed}</div><div class="sh-vital-l">Speed</div></div>
      </div>
      <div class="sc-class-line">${s.class}${s.subclass?' &middot; '+s.subclass:''}</div>
      <div class="sh-ability-grid">
        ${stats.map(({key,label,val})=>`
          <div class="sh-ability${key===primary?' primary':''}">
            <div class="sh-ability-label">${label}</div>
            <div class="sh-ability-score">${val}</div>
            <div class="sh-ability-mod">${mod(val)}</div>
          </div>`).join('')}
      </div>
    </div>
    ${(()=>{
      const hasProg = window.AdventureState.hasProgress(scCharId);
      if (hasProg) {
        const st = window.AdventureState.load(scCharId);
        return `
          <button class="sc-begin-btn" onclick="startOrResumeAdventure('${scCharId}')">Resume Your Journey &#8594;</button>
          <div class="sc-status-line">Chapter ${st.chapterIndex} &middot; Level ${st.level} &middot; ${st.hp}/${st.maxHp} HP</div>
        `;
      }
      return `
        <button class="sc-begin-btn" onclick="startOrResumeAdventure('${scCharId}')">Begin the Adventure &#8594;</button>
        <div class="sc-resume" onclick="startOrResumeAdventure('${scCharId}')">Already adventuring? Resume your journey &#8594;</div>
      `;
    })()}
  `;
}

// ── BATTLE STATE ──────────────────────────────────────────────
const BattleState = {
  phase: 'exploration',
  entities: {},
  turnOrder: [],
  currentTurn: 0,
  round: 1,
  actionUsed: false,
  bonusActionUsed: false,
  moveUsed: false,
  narratorCollapsed: false,
};

const SPRITE_COLORS = {
  dennis: '#8B4F9E',
  mac: '#2E5FA3',
  charlie: '#4A7C3F',
  dee: '#C4472A',
  frank: '#8B6914',
  goblin: '#5A7A3A',
  bugbear: '#7A5A3A',
};

// ── ADVENTURE VIEW ────────────────────────────────────────────
export async function startOrResumeAdventure(id) {
  window.activeAdventureId = id;
  await window.PartyState.joinParty(id);

  const sharedState = await window.PartyState.getAdventureState();
  const conversation = await window.PartyState.getConversation();
  const sheet = SHEETS[id].level1;

  window.activeAdventureState = {
    characterId: id,
    level: 1,
    hp: sheet.hp,
    maxHp: sheet.hp,
    chapterIndex: sharedState.chapterIndex || 1,
    roomId: sharedState.roomId || null,
    visitedRooms: sharedState.visitedRooms || [],
    inventory: sharedState.inventory || [],
    gold: sharedState.gold || 0,
    conditions: [],
    conversationHistory: conversation.map(m => ({ role: m.role, content: m.content }))
  };

  openAdventureView(id, window.activeAdventureState);
}

function openAdventureView(id, state) {
  BattleState.phase = 'exploration';
  document.getElementById('adventureView').dataset.phase = 'exploration';
  renderActionBar(id);
  updatePartyHpBar();

  window.PartyState.subscribeToConversation(messages => {
    renderNarrationLog(messages, id);
  });

  window.PartyState.subscribeToHp(hpData => {
    Object.entries(hpData).forEach(([charId, hpObj]) => {
      if (charId === id) {
        window.activeAdventureState.hp = hpObj.hp;
        window.activeAdventureState.maxHp = hpObj.maxHp;
      }
      updateSpriteHpBar(charId, hpObj.hp, hpObj.maxHp);
    });
    updatePartyHpBar();
  });

  document.getElementById('adventureView').classList.add('open');

  if (state.conversationHistory.length === 0) {
    renderOpeningScene(id, state);
  }

  const freeInput = document.getElementById('advFreeInput');
  freeInput.onkeydown = e => {
    if (e.key === 'Enter') submitFreeAction();
    if (e.key === 'Escape') hideFreeInput();
  };
}

export function closeAdventure() {
  document.getElementById('adventureView').classList.remove('open');
}

export function openSheetFromAdventure() {
  openSheet(window.activeAdventureId);
}

// ── BATTLE MAT ────────────────────────────────────────────────
function initBattleMat(id, state) {
  const inner = document.getElementById('advMatInner');
  inner.innerHTML = '';
  BattleState.entities = {};

  const mat = document.getElementById('advMat');
  const cols = Math.floor(mat.offsetWidth / 32);
  const rows = Math.floor((mat.offsetHeight - 80) / 32);
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);

  placeSprite(id, centerCol, centerRow, {
    name: CHARS.find(c => c.id === id)?.name?.split(' ')[0] || id,
    isEnemy: false,
    hp: state.hp,
    maxHp: state.maxHp,
  });

  placeSprite('goblin1', centerCol + 3, centerRow - 2, { name: 'Goblin', isEnemy: true, hp: 7, maxHp: 7 });
  placeSprite('goblin2', centerCol + 4, centerRow, { name: 'Goblin', isEnemy: true, hp: 7, maxHp: 7 });
  placeSprite('goblin3', centerCol + 2, centerRow + 2, { name: 'Goblin', isEnemy: true, hp: 7, maxHp: 7 });
}

function placeSprite(id, col, row, opts) {
  const inner = document.getElementById('advMatInner');

  const wrapper = document.createElement('div');
  wrapper.className = `adv-sprite${opts.isEnemy ? ' enemy' : ''}`;
  wrapper.id = `sprite-${id}`;
  wrapper.style.left = (col * 32) + 'px';
  wrapper.style.top = (row * 32) + 'px';

  const hpBar = document.createElement('div');
  hpBar.className = 'adv-sprite-hp-bar';
  const hpFill = document.createElement('div');
  hpFill.className = 'adv-sprite-hp-fill';
  hpFill.id = `hp-fill-${id}`;
  hpFill.style.width = '100%';
  hpBar.appendChild(hpFill);

  const body = document.createElement('div');
  body.style.cssText = `width:32px;height:32px;background:${SPRITE_COLORS[id] || (opts.isEnemy ? '#5A7A3A' : '#444')};display:flex;align-items:center;justify-content:center;font-size:16px;image-rendering:pixelated;border:1px solid rgba(255,255,255,0.15);`;
  body.textContent = opts.isEnemy ? '👺' : getCharEmoji(id);

  const label = document.createElement('div');
  label.className = 'adv-sprite-label';
  label.textContent = opts.name;

  wrapper.appendChild(hpBar);
  wrapper.appendChild(body);
  wrapper.appendChild(label);
  inner.appendChild(wrapper);

  if (!opts.isEnemy) {
    wrapper.onclick = () => openSheet(id);
  }

  BattleState.entities[id] = { col, row, ...opts };
}

function getCharEmoji(id) {
  const map = { dennis: '🔮', mac: '🛡️', charlie: '🌿', dee: '🎵', frank: '⚔️' };
  return map[id] || '⚔️';
}

function updateSpriteHpBar(charId, hp, maxHp) {
  const fill = document.getElementById(`hp-fill-${charId}`);
  if (!fill) return;
  const pct = Math.max(0, (hp / maxHp) * 100);
  fill.style.width = pct + '%';
  fill.className = 'adv-sprite-hp-fill' + (pct < 25 ? ' danger' : pct < 50 ? ' warning' : '');
}

// ── ACTION BAR ────────────────────────────────────────────────
function renderActionBar(id) {
  const bar = document.getElementById('advActionBar');
  const sheet = SHEETS[id]?.level1;
  if (!sheet) return;

  if (BattleState.phase === 'exploration') {
    bar.innerHTML = `
      <input class="adv-chat-input" id="advChatInput" type="text"
        placeholder="What do you do?"
        autocomplete="off"
        onkeydown="if(event.key==='Enter')window.submitChatInput()">
      <button class="adv-chat-send" onclick="window.submitChatInput()">SEND</button>
    `;
    setTimeout(() => document.getElementById('advChatInput')?.focus(), 50);
    return;
  }

  const actions = getCharacterActions(id, sheet);
  bar.innerHTML = actions.map(a => `
    <button
      class="adv-action-btn ${a.primary ? 'primary' : ''} ${a.used ? 'used' : ''}"
      onclick="handleAction('${a.id}', '${id}')"
    >${a.label}</button>
  `).join('');
}

function getCharacterActions(id, sheet) {
  const base = [
    { id: 'move', label: '↑ MOVE', used: BattleState.moveUsed },
    { id: 'attack', label: '⚔ ATTACK', primary: true, used: BattleState.actionUsed },
  ];
  if (sheet.cantrips?.length) base.push({ id: 'cantrip', label: '✨ CANTRIP', used: BattleState.actionUsed });
  if (sheet.spells_1?.length) base.push({ id: 'spell', label: '📖 SPELL', used: BattleState.actionUsed });
  if (sheet.features?.some(f => f.toLowerCase().includes('rage'))) base.push({ id: 'rage', label: '💢 RAGE', primary: true, used: BattleState.actionUsed });
  if (sheet.features?.some(f => f.toLowerCase().includes('bardic'))) base.push({ id: 'inspire', label: '🎵 INSPIRE', used: BattleState.bonusActionUsed });
  if (sheet.features?.some(f => f.toLowerCase().includes('lay on hands'))) base.push({ id: 'heal', label: '🤲 HEAL', used: BattleState.bonusActionUsed });
  base.push({ id: 'custom', label: '💬 OTHER' });
  return base;
}

export async function handleAction(actionId, charId) {
  const sheet = SHEETS[charId]?.level1;
  const charName = CHARS.find(c => c.id === charId)?.name;

  if (actionId === 'custom') { showFreeInput(); return; }

  if (actionId === 'move') {
    BattleState.moveUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} moves into position.`); return;
  }
  if (actionId === 'attack') {
    BattleState.actionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} attacks the nearest enemy.`); return;
  }
  if (actionId === 'cantrip') {
    BattleState.actionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} casts ${sheet.cantrips?.[0] || 'a cantrip'}.`); return;
  }
  if (actionId === 'spell') {
    BattleState.actionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} casts ${sheet.spells_1?.[0] || 'a spell'}.`); return;
  }
  if (actionId === 'rage') {
    BattleState.actionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} enters a rage.`); return;
  }
  if (actionId === 'inspire') {
    BattleState.bonusActionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} uses Bardic Inspiration on an ally.`); return;
  }
  if (actionId === 'heal') {
    BattleState.bonusActionUsed = true; renderActionBar(charId);
    await submitAction(charId, `${charName} uses Lay on Hands.`); return;
  }
}

// ── EXPLORATION CHAT INPUT ────────────────────────────────────
function submitChatInput() {
  const input = document.getElementById('advChatInput');
  const text = input?.value?.trim();
  if (!text) return;
  input.value = '';
  submitAction(window.activeAdventureId, text);
}

// ── FREE INPUT ────────────────────────────────────────────────
export function showFreeInput() {
  document.getElementById('advFreeInputOverlay').classList.add('visible');
  document.getElementById('advFreeInput').focus();
}

export function hideFreeInput() {
  document.getElementById('advFreeInputOverlay').classList.remove('visible');
  document.getElementById('advFreeInput').value = '';
}

export async function submitFreeAction() {
  const input = document.getElementById('advFreeInput');
  const text = input.value.trim();
  if (!text) return;
  hideFreeInput();
  await submitAction(window.activeAdventureId, text);
}

// ── CORE ACTION SUBMIT ────────────────────────────────────────
async function submitAction(charId, actionText) {
  const state = window.activeAdventureState;
  const char = CHARS.find(c => c.id === charId);

  await window.PartyState.pushPlayerMessage(charId, actionText);
  appendToNarrationLog('…', 'typing');

  try {
    const conversation = await window.PartyState.getConversation();
    state.conversationHistory = conversation.map(m => ({ role: m.role, content: m.content }));
    const systemPrompt = buildSystemPrompt(charId, state);

    const rawReply = await callChatApi(systemPrompt, state.conversationHistory) || 'The dungeon stirs.';
    const reply = rawReply.replace('<COMBAT_START>', '').trim();
    removeTypingIndicator();
    await window.PartyState.pushDMMessage(reply);

    if (rawReply.includes('<COMBAT_START>') && BattleState.phase === 'exploration') {
      BattleState.phase = 'combat';
      document.getElementById('adventureView').dataset.phase = 'combat';
      initBattleMat(charId, state);
      renderActionBar(charId);
    }

    const charFirstName = char?.name?.split(' ')[0]?.toLowerCase();
    const replyLower = reply.toLowerCase();
    const nameMentioned = charFirstName && replyLower.includes(charFirstName);
    const dmgMatch = reply.match(/(\d+)\s*(damage|points)/i);

    if (dmgMatch && nameMentioned) {
      const dmg = parseInt(dmgMatch[1]);
      const newHp = Math.max(0, state.hp - dmg);
      window.AdventureState.setHp(state, newHp);
      await window.PartyState.setCharacterHp(charId, newHp, state.maxHp);
      updateSpriteHpBar(charId, newHp, state.maxHp);
      updatePartyHpBar();
    }

    BattleState.actionUsed = false;
    BattleState.bonusActionUsed = false;
    BattleState.moveUsed = false;
    renderActionBar(charId);

  } catch (err) {
    removeTypingIndicator();
    appendToNarrationLog('The dungeon stirs but does not speak.', 'system');
    console.error('[Adventure]', err);
  }
}

// ── NARRATION ─────────────────────────────────────────────────
function renderNarrationLog(messages, activeCharId) {
  const log = document.getElementById('advNarrationLog');
  if (!log) return;
  log.innerHTML = '';
  messages.slice(-8).forEach(msg => {
    if (msg.role === 'assistant') {
      if (msg.content.includes('How do you want to do this?')) {
        const hdywdt = document.createElement('div');
        hdywdt.className = 'adv-hdywdt';
        hdywdt.textContent = 'How do you want to do this?';
        log.appendChild(hdywdt);
      } else {
        appendToNarrationLog(msg.content, 'narration');
      }
    } else {
      const char = CHARS.find(c => c.id === msg.character);
      const label = char?.name?.split(' ')[0] || msg.character;
      appendToNarrationLog(`${label}: ${msg.content}`, 'player');
    }
  });
  const panel = document.getElementById('advNarrationPanel');
  panel.scrollTop = panel.scrollHeight;
}

function appendToNarrationLog(text, type) {
  const log = document.getElementById('advNarrationLog');
  if (!log) return;
  const el = document.createElement('div');
  el.className = `adv-narration-text${type === 'player' ? ' player-msg' : type === 'system' ? ' system-msg' : ''}${type === 'typing' ? ' adv-typing-indicator' : ''}`;
  el.textContent = text;
  log.appendChild(el);
}

function removeTypingIndicator() {
  const el = document.querySelector('.adv-typing-indicator');
  if (el) el.remove();
}

export function toggleNarration() {
  const panel = document.getElementById('advNarrationPanel');
  const btn = document.getElementById('advNarrationToggle');
  BattleState.narratorCollapsed = !BattleState.narratorCollapsed;
  panel.classList.toggle('collapsed', BattleState.narratorCollapsed);
  btn.textContent = BattleState.narratorCollapsed ? '▲ LOG' : '▼ LOG';
}

// ── PARTY HP TOPBAR ───────────────────────────────────────────
function updatePartyHpBar() {
  const bar = document.getElementById('advPartyHp');
  if (!bar) return;
  const state = window.activeAdventureState;
  if (!state) return;
  const char = CHARS.find(c => c.id === state.characterId);
  const name = char?.name?.split(' ')[0] || state.characterId;
  const pct = state.hp / state.maxHp;
  bar.innerHTML = `<span class="adv-hp-pill ${pct < 0.5 ? 'danger' : ''}">${name} ${state.hp}/${state.maxHp} HP</span>`;
}

// ── OPENING SCENE ─────────────────────────────────────────────
async function renderOpeningScene(id, state) {
  const existing = await window.PartyState.getConversation();
  if (existing.length > 0) return;

  const char = CHARS.find(c => c.id === id);
  const rooms = window.DataEngine.getChapterRooms(1);
  const firstRoom = rooms[0];

  await window.PartyState.updateAdventureState({
    chapterIndex: 1,
    roomId: firstRoom?.id || null,
    visitedRooms: [firstRoom?.name || 'Cave Mouth']
  });

  appendToNarrationLog('Chapter 1: Goblin Arrows', 'system');
  appendToNarrationLog('…', 'typing');

  try {
    const openingPrompt = `The adventure begins. Set the scene at the start of the Triboar Trail. The party is about to encounter goblins. Address ${char.name} directly. Be brief and cinematic.`;
    const systemPrompt = buildSystemPrompt(id, state);

    const reply = await callChatApi(systemPrompt, [{ role: 'user', content: openingPrompt }])
      || 'The trail stretches ahead into shadow.';
    removeTypingIndicator();
    await window.PartyState.pushDMMessage(reply);

  } catch (err) {
    removeTypingIndicator();
    await window.PartyState.pushDMMessage('The Triboar Trail stretches into shadow. Something moves in the trees.');
    console.error('[Adventure] Opening scene error:', err);
  }
}

// ── INIT: expose globals needed by inline HTML onclick handlers ──
export function initSummerCamp() {
  window.startOrResumeAdventure = startOrResumeAdventure;
  window.submitChatInput = submitChatInput;
  window.handleAction = handleAction;
  window.closeAdventure = closeAdventure;
  window.openSheetFromAdventure = openSheetFromAdventure;
  window.toggleNarration = toggleNarration;
  window.closeSummerCamp = closeSummerCamp;
  window.closeSheet = closeSheet;
  window.setSheetLevel = setSheetLevel;
  window.openSheet = openSheet;
}
