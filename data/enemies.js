// Lost Mines of Phandelver enemy stat blocks (5e SRD values)
export const ENEMIES = {
  goblin: {
    name: 'Goblin',
    hp: 7, maxHp: 7, ac: 15, speed: 30,
    attackBonus: 4, damageDice: '1d6', damageMod: 2,
    initiativeMod: 2,
    strMod: -1, dexMod: 2, conMod: 0, intMod: -1, wisMod: -1, chaMod: -2,
  },
  bugbear: {
    name: 'Bugbear',
    hp: 27, maxHp: 27, ac: 12, speed: 30,
    attackBonus: 4, damageDice: '2d8', damageMod: 2,
    initiativeMod: 2,
    strMod: 3, dexMod: 2, conMod: 1, intMod: -1, wisMod: -1, chaMod: -2,
  },
  wolf: {
    name: 'Wolf',
    hp: 11, maxHp: 11, ac: 13, speed: 40,
    attackBonus: 4, damageDice: '2d4', damageMod: 2,
    initiativeMod: 2,
    strMod: 1, dexMod: 2, conMod: 1, intMod: -4, wisMod: 1, chaMod: -2,
  },
  skeleton: {
    name: 'Skeleton',
    hp: 13, maxHp: 13, ac: 13, speed: 30,
    attackBonus: 4, damageDice: '1d6', damageMod: 2,
    initiativeMod: 2,
    strMod: 0, dexMod: 2, conMod: -1, intMod: -4, wisMod: -2, chaMod: -3,
  },
  zombie: {
    name: 'Zombie',
    hp: 22, maxHp: 22, ac: 8, speed: 20,
    attackBonus: 3, damageDice: '1d6', damageMod: 1,
    initiativeMod: -2,
    strMod: 1, dexMod: -2, conMod: 3, intMod: -4, wisMod: -2, chaMod: -3,
  },
  redbrand: {
    name: 'Redbrand Ruffian',
    hp: 16, maxHp: 16, ac: 14, speed: 30,
    attackBonus: 3, damageDice: '1d6', damageMod: 1,
    initiativeMod: 1,
    strMod: 2, dexMod: 1, conMod: 1, intMod: -1, wisMod: 0, chaMod: -1,
  },
  nothic: {
    name: 'Nothic',
    hp: 45, maxHp: 45, ac: 15, speed: 30,
    attackBonus: 4, damageDice: '1d6', damageMod: 2,
    initiativeMod: 3,
    strMod: 1, dexMod: 3, conMod: 1, intMod: 2, wisMod: 0, chaMod: -1,
  },
  glasstaff: {
    name: 'Glasstaff',
    hp: 22, maxHp: 22, ac: 12, speed: 30,
    attackBonus: 4, damageDice: '1d6', damageMod: 2,
    initiativeMod: 2,
    strMod: -1, dexMod: 2, conMod: 1, intMod: 3, wisMod: 1, chaMod: 0,
  },
};
