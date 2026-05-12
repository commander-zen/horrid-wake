import { CHARS } from './characters.js';
import { ENEMIES } from '../data/enemies.js';
import { rollInitiative, rollAttack, rollDamage, checkHit } from './dice.js';

const PATH = '/sessions/lostmines/combat';

function db() { return window.firebaseDb; }

function statMod(score) { return Math.floor((score - 10) / 2); }

function dexMod(charId) {
  const c = CHARS.find(c => c.id === charId);
  return c ? statMod(c.stats.DEX) : 0;
}

function playerAC(charId) {
  const c = CHARS.find(c => c.id === charId);
  return c ? c.ac : 10;
}

function playerMaxHp(charId) {
  const c = CHARS.find(c => c.id === charId);
  return c ? c.hp : 10;
}

export async function startCombat(playerIds, enemyList) {
  const combatants = [];

  for (const charId of playerIds) {
    const c = CHARS.find(c => c.id === charId);
    if (!c) continue;
    combatants.push({
      id: charId,
      name: c.name,
      initiative: rollInitiative(dexMod(charId)),
      hp: c.hp,
      maxHp: c.hp,
      ac: c.ac,
      type: 'player',
      characterId: charId,
      conditions: [],
    });
  }

  const enemyInstances = {};
  const enemyCounts = {};
  for (const enemyType of enemyList) {
    const template = ENEMIES[enemyType];
    if (!template) continue;
    enemyCounts[enemyType] = (enemyCounts[enemyType] || 0) + 1;
    const instanceId = `${enemyType}_${enemyCounts[enemyType]}`;
    const instance = {
      id: instanceId,
      name: enemyCounts[enemyType] > 1 ? `${template.name} ${enemyCounts[enemyType]}` : template.name,
      initiative: rollInitiative(template.initiativeMod),
      hp: template.hp,
      maxHp: template.maxHp,
      ac: template.ac,
      type: 'enemy',
      enemyType,
      conditions: [],
    };
    combatants.push(instance);
    enemyInstances[instanceId] = {
      type: enemyType,
      hp: template.hp,
      maxHp: template.maxHp,
      ac: template.ac,
      attackBonus: template.attackBonus,
      damageDice: template.damageDice,
      damageMod: template.damageMod,
    };
  }

  combatants.sort((a, b) => b.initiative - a.initiative);

  await db().ref(PATH).set({
    active: true,
    round: 1,
    currentTurnIndex: 0,
    initiativeOrder: combatants,
    enemies: enemyInstances,
    log: [],
  });
}

export async function endCombat() {
  await db().ref(PATH).update({ active: false });
}

export async function getCurrentTurn() {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state || !state.active) return null;
  return state.initiativeOrder[state.currentTurnIndex] || null;
}

export async function advanceTurn() {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state || !state.active) return;

  const order = state.initiativeOrder;
  let idx = state.currentTurnIndex;
  let wrapped = false;
  let attempts = 0;

  do {
    idx++;
    if (idx >= order.length) { idx = 0; wrapped = true; }
    attempts++;
  } while (order[idx].hp <= 0 && attempts < order.length);

  await db().ref(PATH).update({
    currentTurnIndex: idx,
    round: wrapped ? state.round + 1 : state.round,
  });
}

export async function applyDamage(targetId, amount) {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state) return;

  const order = [...state.initiativeOrder];
  const idx = order.findIndex(c => c.id === targetId);
  if (idx === -1) return;

  order[idx].hp = Math.max(0, order[idx].hp - amount);
  await db().ref(PATH + '/initiativeOrder').set(order);

  if (order[idx].type === 'enemy') {
    await db().ref(`${PATH}/enemies/${targetId}/hp`).set(order[idx].hp);
  }
}

export async function applyHealing(targetId, amount) {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state) return;

  const order = [...state.initiativeOrder];
  const idx = order.findIndex(c => c.id === targetId);
  if (idx === -1) return;

  order[idx].hp = Math.min(order[idx].maxHp, order[idx].hp + amount);
  await db().ref(PATH + '/initiativeOrder').set(order);
}

export async function getEnemyAction(enemyId) {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state || !state.active) return null;

  const enemyData = state.enemies[enemyId];
  if (!enemyData) return null;

  const attacker = state.initiativeOrder.find(c => c.id === enemyId);
  if (!attacker || attacker.hp <= 0) return null;

  const livingPlayers = state.initiativeOrder.filter(c => c.type === 'player' && c.hp > 0);
  if (!livingPlayers.length) return null;

  const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
  const attackResult = rollAttack(enemyData.attackBonus);
  const hit = checkHit(attackResult.total, target.ac);

  let damage = 0;
  if (hit) {
    const dmgResult = rollDamage(enemyData.damageDice, enemyData.damageMod);
    damage = dmgResult.total;
    await applyDamage(target.id, damage);
  }

  await advanceTurn();

  return {
    attacker: attacker.name,
    target: target.name,
    roll: attackResult.roll,
    total: attackResult.total,
    isCrit: attackResult.isCrit,
    hit,
    damage,
  };
}
