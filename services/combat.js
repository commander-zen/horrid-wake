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

function buildPlayerCombatant(charId) {
  const c = CHARS.find(c => c.id === charId);
  if (!c) return null;
  return {
    id: charId,
    name: c.name,
    initiative: rollInitiative(dexMod(charId)),
    hp: c.hp,
    maxHp: c.hp,
    ac: c.ac,
    type: 'player',
    characterId: charId,
    conditions: [],
  };
}

// Reads present players from Firebase presence, adds all to initiative alongside enemies
export async function startCombat(enemyList) {
  const presenceSnap = await db().ref('/sessions/lostmines/presence').once('value');
  const presence = presenceSnap.val() || {};
  const playerIds = Object.keys(presence);

  const combatants = [];
  for (const charId of playerIds) {
    const combatant = buildPlayerCombatant(charId);
    if (combatant) combatants.push(combatant);
  }

  const enemyInstances = {};
  const enemyCounts = {};
  for (const enemyType of enemyList) {
    const template = ENEMIES[enemyType];
    if (!template) continue;
    enemyCounts[enemyType] = (enemyCounts[enemyType] || 0) + 1;
    const instanceId = `${enemyType}_${enemyCounts[enemyType]}`;
    combatants.push({
      id: instanceId,
      name: enemyCounts[enemyType] > 1 ? `${template.name} ${enemyCounts[enemyType]}` : template.name,
      initiative: rollInitiative(template.initiativeMod),
      hp: template.hp,
      maxHp: template.maxHp,
      ac: template.ac,
      type: 'enemy',
      enemyType,
      conditions: [],
    });
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

// Adds a late-joining player into the correct initiative slot
export async function addPlayerToCombat(characterId) {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state || !state.active) return;

  if (state.initiativeOrder.find(c => c.id === characterId)) return;

  const combatant = buildPlayerCombatant(characterId);
  if (!combatant) return;

  const order = [...state.initiativeOrder];
  let insertIdx = order.findIndex(c => c.initiative < combatant.initiative);
  if (insertIdx === -1) insertIdx = order.length;
  order.splice(insertIdx, 0, combatant);

  // Shift currentTurnIndex if we inserted before it
  const currentTurnIndex = insertIdx <= state.currentTurnIndex
    ? state.currentTurnIndex + 1
    : state.currentTurnIndex;

  await db().ref(PATH).update({ initiativeOrder: order, currentTurnIndex });
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

// Returns { attacker, target, attacks: [{ target, roll, total, isCrit, hit, damage }] }
export async function getEnemyAction(enemyId) {
  const snap = await db().ref(PATH).once('value');
  const state = snap.val();
  if (!state || !state.active) return null;

  const enemyData = state.enemies[enemyId];
  if (!enemyData) return null;

  const attacker = state.initiativeOrder.find(c => c.id === enemyId);
  if (!attacker || attacker.hp <= 0) return null;

  const template = ENEMIES[enemyData.type];
  const attacksPerTurn = template?.attacksPerTurn || 1;
  const attacks = [];

  for (let i = 0; i < attacksPerTurn; i++) {
    // Re-read initiative order so HP reflects prior attacks in this loop
    const currentSnap = await db().ref(PATH + '/initiativeOrder').once('value');
    const currentOrder = currentSnap.val() || state.initiativeOrder;
    const livingPlayers = currentOrder.filter(c => c.type === 'player' && c.hp > 0);
    if (!livingPlayers.length) break;

    const target = livingPlayers[Math.floor(Math.random() * livingPlayers.length)];
    const attackResult = rollAttack(enemyData.attackBonus);
    const hit = checkHit(attackResult.total, target.ac);
    let damage = 0;

    if (hit) {
      const dmgResult = rollDamage(enemyData.damageDice, enemyData.damageMod);
      damage = dmgResult.total;
      await applyDamage(target.id, damage);
    }

    attacks.push({
      target: target.name,
      targetAc: target.ac,
      attackBonus: enemyData.attackBonus,
      roll: attackResult.roll,
      total: attackResult.total,
      isCrit: attackResult.isCrit,
      hit,
      damage,
    });
  }

  await advanceTurn();

  return { attacker: attacker.name, attacks };
}
