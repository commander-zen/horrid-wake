// Pure dice-rolling utilities — no dependencies

export function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollMultiple(count, sides) {
  const rolls = [];
  for (let i = 0; i < count; i++) rolls.push(roll(sides));
  return { rolls, total: rolls.reduce((s, n) => s + n, 0) };
}

export function rollInitiative(mod) {
  return roll(20) + mod;
}

export function rollAttack(attackBonus) {
  const r = roll(20);
  return { roll: r, total: r + attackBonus, isCrit: r === 20 };
}

// Parses '2d6', '1d8', etc.
export function rollDamage(diceString, mod = 0) {
  const [countStr, sidesStr] = diceString.toLowerCase().split('d');
  const count = parseInt(countStr, 10);
  const sides = parseInt(sidesStr, 10);
  const { rolls, total } = rollMultiple(count, sides);
  return { rolls, total: total + mod };
}

export function checkHit(attackTotal, targetAC) {
  return attackTotal >= targetAC;
}
