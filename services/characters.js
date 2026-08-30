// Claims known before anyone opens the app. Anything claimed in-app is kept
// in localStorage on that phone — see the note in detailPanel.js about why
// cross-device dibs would need a backend we deliberately deleted.
export const KNOWN_DIBS = {
  aragorn: 'Logan',
};

export const CHARS = [
  {
    id: 'frodo', short: 'Frodo', name: 'Frodo Baggins',
    cls: 'Hobbit of the Shire · Treasure Hunter',
    role: "Sneaks past anything. Carries the thing nobody else can.",
    tag: '"I will take the Ring, though I do not know the way."',
    lore: 'Bilbo’s heir and the least likely hero in the company. Carries a weight nobody else can carry for him, and says less about it than anyone would like.',
    hp: 34, ac: 15, speed: 25, prof: 3,
    stats: { STR:8, DEX:16, CON:14, INT:14, WIS:14, CHA:14 },
    imgKey: 'frodo', accentColor: '#8a7a4a',
  },
  {
    id: 'sam', short: 'Sam', name: 'Samwise Gamgee',
    cls: 'Hobbit of the Shire · Warden',
    role: "Keeps people alive. Hits harder than a gardener should.",
    tag: '"I can’t carry it for you, but I can carry you."',
    lore: 'Gardener of Bag End. Brought rope, a frying pan, and a stubbornness that outlasts everything the road throws at it. The most dangerous loyalty in Middle-earth.',
    hp: 46, ac: 15, speed: 25, prof: 3,
    stats: { STR:14, DEX:14, CON:16, INT:10, WIS:14, CHA:12 },
    imgKey: 'sam', accentColor: '#5a7a3a',
  },
  {
    id: 'aragorn', short: 'Aragorn', name: 'Aragorn, Son of Arathorn',
    cls: 'Ranger of the North · Captain',
    role: "Leads from the front. Tracks anything. Hits hard.",
    tag: '"I am Aragorn, son of Arathorn. If by life or death I can save you, I will."',
    lore: 'Heir to a throne he has spent his life avoiding. Reads tracks like a book, orc-sign better than most rangers read maps. Andúril was reforged for this. He is trying very hard not to make that a whole thing.',
    hp: 44, ac: 16, speed: 30, prof: 3,
    stats: { STR:16, DEX:16, CON:14, INT:12, WIS:16, CHA:14 },
    imgKey: 'aragorn', accentColor: '#7a6a3a',
  },
  {
    id: 'legolas', short: 'Legolas', name: 'Legolas Greenleaf',
    cls: 'Elf of Lindon · Champion',
    role: "Kills things before they reach you. Never misses.",
    tag: '"A red sun rises. Blood has been spilled this night."',
    lore: 'Prince of the Woodland Realm. Counts his kills out loud, mostly to needle Gimli. Can walk on snow without sinking and has never once let anyone forget it.',
    hp: 38, ac: 17, speed: 35, prof: 3,
    stats: { STR:12, DEX:20, CON:14, INT:12, WIS:16, CHA:12 },
    imgKey: 'legolas', accentColor: '#3a6a3a',
  },
  {
    id: 'gimli', short: 'Gimli', name: 'Gimli, son of Glóin',
    cls: 'Dwarf of Durin’s Folk · Champion',
    role: "Hits hardest, dies last. Subtlety is not on the menu.",
    tag: '"Certainty of death. Small chance of success. What are we waiting for?"',
    lore: 'Dwarf of the Lonely Mountain. Keeps a running tally of kills against Legolas and cheats at the count. Distrusts elves on principle, is currently losing that argument with himself.',
    hp: 58, ac: 16, speed: 25, prof: 3,
    stats: { STR:18, DEX:10, CON:18, INT:8, WIS:10, CHA:8 },
    imgKey: 'gimli', accentColor: '#8a3a1a',
  },
  {
    id: 'boromir', short: 'Boromir', name: 'Boromir of Gondor',
    cls: 'Barding · Captain',
    role: "The wall. Soaks the damage so nobody else has to.",
    tag: '"One does not simply walk into Mordor. One brings a shield wall."',
    lore: 'Captain of the White Tower, here to see Gondor saved by whatever means necessary. The Ring keeps whispering to him. He keeps telling it to wait its turn.',
    hp: 52, ac: 18, speed: 30, prof: 3,
    stats: { STR:18, DEX:12, CON:16, INT:10, WIS:12, CHA:14 },
    imgKey: 'boromir', accentColor: '#8a2a2a',
  },
  {
    id: 'merry', short: 'Merry', name: 'Meriadoc Brandybuck',
    cls: 'Hobbit of the Shire · Scholar',
    role: "Knows things. Patches you up. Reads the map.",
    tag: '"You are in league with... no mortal can hinder me."',
    lore: 'Everyone keeps forgetting the halflings are dangerous. That is the plan. Underestimated in every room he has ever stood in, which has worked out extremely well for him so far.',
    hp: 36, ac: 16, speed: 25, prof: 3,
    stats: { STR:10, DEX:18, CON:14, INT:12, WIS:14, CHA:12 },
    imgKey: 'merry', accentColor: '#5a7a3a',
  },
  {
    id: 'pippin', short: 'Pippin', name: 'Peregrin Took',
    cls: 'Hobbit of the Shire · Messenger',
    role: "Talks the party up. Buffs everyone. Causes incidents.",
    tag: '"Fool of a Took. But at least he can carry a tune."',
    lore: 'Guard of the Citadel, connoisseur of second breakfasts, professional accident-haver. Louder than the situation usually calls for. Braver than the situation usually deserves.',
    hp: 33, ac: 14, speed: 25, prof: 3,
    stats: { STR:10, DEX:14, CON:12, INT:12, WIS:10, CHA:18 },
    imgKey: 'pippin', accentColor: '#b8943a',
  },
];

export const IDENTITY = {
  frodo: {
    doesLabel: 'HE DOES:',
    does: 'Goes unseen where nobody else can, endures what would break stronger folk, and keeps going anyway.',
    forPlayer: "The player who wants the quiet, heavy role. You're not the strongest at the table — you're the one who doesn't put it down.",
  },
  sam: {
    doesLabel: 'HE DOES:',
    does: 'Holds the line beside whoever needs him, cooks, climbs, and hits far harder than a gardener has any business hitting.',
    forPlayer: 'The player who wants to be the reason someone else survives. Unglamorous, immovable, and the best friend anyone at this table will have.',
  },
  aragorn: {
    doesLabel: 'HE DOES:',
    does: 'Leads from the front, tracks anything, and fights with a blade that has a better résumé than most kings.',
    forPlayer: "The player who wants to be reluctantly in charge. You didn't ask to be the leader — you just keep being right about everything.",
  },
  legolas: {
    doesLabel: 'HE DOES:',
    does: "Drops enemies at range before they close the distance, moves like the terrain isn't there, and never misses.",
    forPlayer: 'The player who wants to be effortlessly excellent. You make hard things look easy, and you will mention that it was easy.',
  },
  gimli: {
    doesLabel: 'HE DOES:',
    does: "Charges into the thickest part of the fight, shrugs off hits that should have ended him, and swings an axe like an argument he's winning.",
    forPlayer: "The player who wants to hit things until they stop being a problem. Subtlety is someone else's job.",
  },
  boromir: {
    doesLabel: 'HE DOES:',
    does: 'Holds the line, protects the party at personal cost, and hits like a wall falling on you.',
    forPlayer: "The player who wants to be the one everyone can count on — and who's quietly wrestling with a temptation the rest of the party doesn't need to know about.",
  },
  merry: {
    doesLabel: 'HE DOES:',
    does: "Slips past enemies unseen, strikes where it counts, and gets underestimated right up until it's too late for the other guy.",
    forPlayer: "The player who wants to be quietly, devastatingly effective. Nobody's watching the halfling. That's the point.",
  },
  pippin: {
    doesLabel: 'HE DOES:',
    does: 'Inspires the party, talks his way into and out of trouble, and occasionally saves the day by accident.',
    forPlayer: "The player who wants comic relief with a spine. You're here for a good time, and somehow also the reason everyone's still alive.",
  },
};

export const PRIMARY_STAT = { frodo:'dex', sam:'con', aragorn:'wis', legolas:'dex', gimli:'str', boromir:'str', merry:'dex', pippin:'cha' };

// Level-5 builds for The Lord of the Rings Roleplaying (Free League, 5e).
//
// Derived from the core rules: standard array + the culture's ability
// bonuses + the virtue ASIs each calling grants by 5th level. Rewards come
// at 3rd and 5th level, so everyone has exactly two.
//
// Note the system's own vocabulary: races are CULTURES, classes are
// CALLINGS, and each calling carries a SHADOW PATH used by the Shadow
// rules in Chapter 8.
export const SHEETS = {
  frodo: {
    culture: "Hobbit of the Shire",
    subculture: "Fallohide",
    calling: "Treasure Hunter",
    path: "Burglar",
    shadowPath: "Dragon-Sickness",
    background: "Tookish Blood",
    standard: "Common",
    size: "Small",
    hitDie: "d8",
    hp: 33,
    ac: 15,
    speed: 25,
    prof: 3,
    str: 8,
    dex: 18,
    con: 12,
    int: 13,
    wis: 14,
    cha: 10,
    saves: ["dex", "int"],
    skills: {
      Investigation: 6,
      "Old Lore": 4,
      Perception: 5,
      Riddle: 4,
      Stealth: 10,
      Travel: 5
    },
    virtues: ["Art of Disappearing"],
    rewards: ["Close-fitting Mail-shirt (mithril)", "Keen Sword"],
    features: ["Expertise (Stealth, Riddle)", "Sneak Attack (3d6)", "Cunning Action", "Clever-Handed", "Tree-Climber", "Uncanny Dodge", "Hobbit-Sense (advantage on saves vs Shadow)", "Unobtrusive"],
    equipment: ["Sting (sword)", "Mithril mail-shirt", "Elven cloak", "Phial of Galadriel", "Thieves' tools", "Pipe"],
    languages: ["Westron"],
    distinctive: ["Eager", "Honourable"]
  },
  sam: {
    culture: "Hobbit of the Shire",
    subculture: "Harfoot",
    calling: "Warden",
    path: "Hunter",
    shadowPath: "Path of Despair",
    background: "Restless Farmer",
    standard: "Common",
    size: "Small",
    hitDie: "d10",
    hp: 49,
    ac: 16,
    speed: 25,
    prof: 3,
    str: 14,
    dex: 14,
    con: 17,
    int: 8,
    wis: 14,
    cha: 10,
    saves: ["str", "wis"],
    skills: {
      "Animal Handling": 5,
      Athletics: 5,
      Nature: 2,
      Perception: 5,
      Stealth: 5,
      Travel: 5
    },
    virtues: ["Prowess", "Tough as Old Tree-Roots"],
    rewards: ["Reinforced Shield", "Grievous Sword"],
    features: ["Shadow-Lore (Orcs)", "Warded Lands (the Shire)", "Fighting Style: Protection", "Hunter's Prey: Goblin-Cleaver", "Rumour of the Earth", "Extra Attack", "Hobbit-Sense (advantage on saves vs Shadow)", "Unobtrusive"],
    equipment: ["Barrow-blade (sword)", "Shield", "Hide armour", "Elven rope", "Box of Lórien earth", "Cook's utensils", "Pipe"],
    languages: ["Westron"],
    distinctive: ["Faithful", "Rustic"]
  },
  merry: {
    culture: "Hobbit of the Shire",
    subculture: "Stoor",
    calling: "Scholar",
    path: "Lore",
    shadowPath: "Lure of Secrets",
    background: "Bucklander",
    standard: "Common",
    size: "Small",
    hitDie: "d8",
    hp: 33,
    ac: 14,
    speed: 25,
    prof: 3,
    str: 8,
    dex: 15,
    con: 12,
    int: 17,
    wis: 14,
    cha: 10,
    saves: ["int", "wis"],
    skills: {
      Hunting: 5,
      Investigation: 6,
      Medicine: 6,
      "Old Lore": 9,
      Perception: 5,
      Riddle: 6,
      Stealth: 5
    },
    virtues: ["Prowess"],
    rewards: ["Keen Sword", "Cunning-make Leather Shirt"],
    features: ["Crafts (Rune-craft, Song-craft)", "Rhymes of Lore (d8)", "Unending Rhymes", "Unarmoured Defence", "Cunning Mind", "Hands of a Healer", "Expertise (Old Lore, cartographer's tools)", "Lore-Master", "Hobbit-Sense (advantage on saves vs Shadow)"],
    equipment: ["Barrow-blade (sword)", "Healer's kit", "Cartographer's tools", "Maps of the Shire and Buckland", "Pipe"],
    languages: ["Westron"],
    distinctive: ["Rustic", "Wary"]
  },
  pippin: {
    culture: "Hobbit of the Shire",
    subculture: "Fallohide",
    calling: "Messenger",
    path: "Herald",
    shadowPath: "Wandering-Madness",
    background: "Tookish Blood",
    standard: "Common",
    size: "Small",
    hitDie: "d8",
    hp: 33,
    ac: 17,
    speed: 30,
    prof: 3,
    str: 8,
    dex: 16,
    con: 13,
    int: 10,
    wis: 12,
    cha: 18,
    saves: ["dex", "cha"],
    skills: {
      Deception: 7,
      "Old Lore": 6,
      Perception: 4,
      Performance: 7,
      Persuasion: 7,
      Riddle: 6,
      Stealth: 6,
      Travel: 4
    },
    virtues: ["Prowess", "Three is Company"],
    rewards: ["Grievous Sword", "Reinforced Shield"],
    features: ["Folk-Lore (double proficiency on Old Lore)", "Tireless and Swift (+5 ft.)", "Unarmoured Defence", "Sneak Attack (1d6)", "Errand Runner", "Forth to Battle", "Fighting Style: Defense", "Uncanny Dodge", "Hobbit-Sense (advantage on saves vs Shadow)"],
    equipment: ["Sword", "Shield", "Livery of the Citadel", "Pipe", "A gaming set"],
    languages: ["Westron"],
    distinctive: ["Eager", "Merry"]
  },
  aragorn: {
    culture: "Ranger of the North",
    subculture: null,
    calling: "Captain",
    path: "Chieftain",
    shadowPath: "Lure of Power",
    background: "Hunter of Orcs",
    standard: "Frugal",
    size: "Medium",
    hitDie: "d10",
    hp: 44,
    ac: 16,
    speed: 35,
    prof: 3,
    str: 18,
    dex: 10,
    con: 14,
    int: 8,
    wis: 13,
    cha: 16,
    saves: ["con", "cha"],
    skills: {
      Athletics: 7,
      Explore: 4,
      Hunting: 7,
      Insight: 4,
      Perception: 4,
      Persuasion: 6,
      Stealth: 6,
      Travel: 4
    },
    virtues: ["Prowess", "Royalty Revealed"],
    rewards: ["Fell Long Sword (Andúril)", "Close-fitting Ring-mail"],
    features: ["Leadership", "Fighting Style: Dueling", "Valiant", "Challenge", "Extra Attack", "Wandering Folk (Hunting, Stealth)"],
    equipment: ["Andúril, Flame of the West (long sword)", "Ring-mail", "Bow and 20 arrows", "Elven cloak", "Leatherworker's tools", "Pipe"],
    languages: ["Westron", "Sindarin"],
    distinctive: ["Bold", "Stern"]
  },
  boromir: {
    culture: "Barding",
    subculture: null,
    calling: "Captain",
    path: "Thane",
    shadowPath: "Lure of Power",
    background: "By Hammer and Anvil",
    standard: "Prosperous",
    size: "Medium",
    hitDie: "d10",
    hp: 44,
    ac: 16,
    speed: 30,
    prof: 3,
    str: 18,
    dex: 10,
    con: 14,
    int: 8,
    wis: 12,
    cha: 15,
    saves: ["con", "cha"],
    skills: {
      Athletics: 7,
      Insight: 4,
      Intimidation: 5,
      Persuasion: 5,
      Travel: 4
    },
    virtues: ["Prowess", "Stout-Hearted"],
    rewards: ["Grievous Long Sword", "Reinforced Shield"],
    features: ["Leadership", "Fighting Style: Protection", "Valiant", "Bright Blade", "Extra Attack", "Archers of Dale (great bow)"],
    equipment: ["Long sword", "Shield", "Ring-mail", "Horn of Gondor", "Smith's tools"],
    languages: ["Westron", "Dalish"],
    distinctive: ["Proud", "Wilful"]
  },
  legolas: {
    culture: "Elf of Lindon",
    subculture: null,
    calling: "Champion",
    path: "Sharp-Shooter",
    shadowPath: "Curse of Vengeance",
    background: "Tower Guard",
    standard: "Frugal",
    size: "Medium",
    hitDie: "d10",
    hp: 44,
    ac: 16,
    speed: 30,
    prof: 3,
    str: 10,
    dex: 19,
    con: 14,
    int: 13,
    wis: 15,
    cha: 8,
    saves: ["str", "con"],
    skills: {
      Acrobatics: 7,
      Investigation: 4,
      Nature: 4,
      "Old Lore": 4,
      Perception: 8,
      Stealth: 7
    },
    virtues: ["Deadly Archery", "Prowess"],
    rewards: ["Keen Great Bow", "Fell Arrow"],
    features: ["Fighting Style: Archery", "Surge of Vigour", "Mighty Shot", "Extra Attack", "Elven-Skill (magical success, 3 per long rest)", "Keen Eyes of the Elves", "Elvish Dreams", "Immortal Folk"],
    equipment: ["Great bow of the Galadhrim", "Quiver of 20 arrows", "Twin white knives", "Leather shirt", "Elven cloak"],
    languages: ["Westron", "Sindarin"],
    distinctive: ["Subtle", "Wary"]
  },
  gimli: {
    culture: "Dwarf of Durin’s Folk",
    subculture: "Erebor",
    calling: "Champion",
    path: "Slayer",
    shadowPath: "Curse of Vengeance",
    background: "The Grief of Azanulbizar",
    standard: "Prosperous",
    size: "Medium",
    hitDie: "d10",
    hp: 59,
    ac: 16,
    speed: 25,
    prof: 3,
    str: 18,
    dex: 12,
    con: 16,
    int: 8,
    wis: 13,
    cha: 10,
    saves: ["str", "con"],
    skills: {
      Athletics: 7,
      Hunting: 4,
      Intimidation: 3,
      Perception: 4
    },
    virtues: ["Prowess", "Baruk Khazâd!"],
    rewards: ["Grievous Battle Axe", "Close-fitting Ring-mail"],
    features: ["Fighting Style: Great Weapon Fighting", "Surge of Vigour", "Sterner Than Steel", "Battle-Fury", "Extra Attack", "Endurance of the Dwarves (+1 HP per level)", "Make Light of Burdens", "Axes of the Dwarves"],
    equipment: ["Dwarven battle axe", "Throwing axes", "Ring-mail", "Smith's tools", "Pipe"],
    languages: ["Westron", "Khuzdul"],
    distinctive: ["Fierce", "Stern"]
  },
};

// ── COMBAT ACTIONS ────────────────────────────────────────────
// What each hero can actually DO on their turn, written for people who have
// never played. `type` is what it costs: move / action / bonus / reaction /
// free. Attack bonuses and damage are derived from the level-5 builds above
// (ability modifier + proficiency +3, plus reward and fighting-style bonuses).
//
// DERIVED, NOT TRANSCRIBED -- worth checking against the book before play.
export const ACTIONS = {
  frodo: [
      { name: "Sting", type: "action", why: "Stab with the elven blade. It glows blue near orcs.", atk: "+7", dmg: "1d6+4", note: "Crits on 19 or 20", tag: "attack" },
      { name: "Sneak Attack", type: "free", why: "If you have the advantage, or a friend is next to your target, add a pile of extra damage. Once per turn.", dmg: "+3d6", tag: "attack" },
      { name: "Cunning Action", type: "bonus", why: "Dash, Disengage, or Hide — for free, every single turn.", tag: "move" },
      { name: "Uncanny Dodge", type: "reaction", why: "You see the hit coming. Take half the damage.", tag: "defend" },
      { name: "Shortbow", type: "action", why: "Shoot from a safe distance.", atk: "+7", dmg: "1d6+4", range: "80 ft", tag: "attack" }
    ],
  sam: [
      { name: "Barrow-blade", type: "action", why: "Swing. You get two swings each turn.", atk: "+5", dmg: "1d6+3", note: "Two attacks per Action", tag: "attack" },
      { name: "Goblin-Cleaver", type: "free", why: "After you hit someone, take a free swing at a different enemy standing next to them.", atk: "+5", dmg: "1d6+3", tag: "attack" },
      { name: "Orc-hunter", type: "free", why: "You've hunted these things. Every hit on an orc does extra damage automatically.", dmg: "+2 vs orcs", tag: "attack" },
      { name: "Protection", type: "reaction", why: "Someone swings at a friend beside you. Get your shield in the way.", tag: "defend" },
      { name: "Rumour of the Earth", type: "action", why: "Go still and listen. You sense whether orcs are nearby, though not where.", uses: "1 per short rest", tag: "utility" }
    ],
  merry: [
      { name: "Barrow-blade", type: "action", why: "Stab something. You're not the fighter, but you're not helpless.", atk: "+5", dmg: "1d6+2", tag: "attack" },
      { name: "Rhymes of Lore", type: "bonus", why: "Shout the right old verse at a friend. They add a d8 to their next roll — and you can reroll it if it's bad.", dmg: "d8 to an ally", uses: "3 per short rest", tag: "support" },
      { name: "Cunning Mind", type: "bonus", why: "Think fast. Make a knowledge check, or Help someone else, without spending your turn.", tag: "utility" },
      { name: "Hands of a Healer", type: "free", why: "During a short rest, patch people up. Everyone resting heals noticeably more.", dmg: "+1d6 per die spent", tag: "support" },
      { name: "Shortbow", type: "action", why: "Shoot from the back. Stay at the back.", atk: "+5", dmg: "1d6+2", range: "80 ft", tag: "attack" }
    ],
  pippin: [
      { name: "Sword", type: "action", why: "Swing. Surprisingly effective for a hobbit.", atk: "+6", dmg: "1d8+4", tag: "attack" },
      { name: "Sneak Attack", type: "free", why: "If you have the advantage, or a friend is next to your target, add extra damage. Once per turn.", dmg: "+1d6", tag: "attack" },
      { name: "Words of the Herald", type: "bonus", why: "Shout something rousing. Help an ally attack from up to 30 feet away.", tag: "support" },
      { name: "Uncanny Dodge", type: "reaction", why: "You see the hit coming. Take half the damage.", tag: "defend" },
      { name: "Shortbow", type: "action", why: "Shoot from a distance.", atk: "+6", dmg: "1d6+3", range: "80 ft", tag: "attack" }
    ],
  aragorn: [
      { name: "Andúril", type: "action", why: "Swing the sword. You get two swings each turn.", atk: "+7", dmg: "1d8+4", note: "Two attacks per Action", tag: "attack" },
      { name: "Longbow", type: "action", why: "Shoot someone far away.", atk: "+3", dmg: "1d8", range: "150 ft", tag: "attack" },
      { name: "Challenge", type: "bonus", why: "Call one enemy out. You hit them more easily, and they struggle to attack anyone but you.", uses: "1 per short rest", tag: "control" },
      { name: "Leadership", type: "action", why: "Rally the party. Everyone nearby gets 8 temporary hit points.", uses: "1 per short rest", tag: "support" },
      { name: "Opportunity attack", type: "reaction", why: "Someone runs away from you — hit them as they go.", atk: "+7", dmg: "1d8+4", tag: "attack" }
    ],
  boromir: [
      { name: "Longsword", type: "action", why: "Swing the sword. You get two swings each turn.", atk: "+7", dmg: "1d8+5", note: "Two attacks per Action", tag: "attack" },
      { name: "Bright Blade", type: "bonus", why: "Your blade blazes. For a minute you hit more often, and the next person to attack that target finds it easier too.", uses: "1 per short rest", tag: "buff" },
      { name: "Leadership", type: "action", why: "Rally the party. Everyone nearby gets 7 temporary hit points.", uses: "1 per short rest", tag: "support" },
      { name: "Protection", type: "reaction", why: "Someone swings at a friend beside you. Get your shield in the way and make it harder to hit them.", tag: "defend" },
      { name: "Horn of Gondor", type: "action", why: "Blow the horn. No mechanical effect — but everyone in earshot knows Gondor came.", tag: "flavour" }
    ],
  legolas: [
      { name: "Great bow", type: "action", why: "Shoot. You get two shots each turn.", atk: "+9", dmg: "1d10+4", range: "150 ft", note: "Two attacks per Action", tag: "attack" },
      { name: "Mighty Shot", type: "free", why: "Put your whole body into a shot: harder to land, much worse if it does.", note: "−1d10 to hit, +2d10 damage", tag: "attack" },
      { name: "Deadly Archery", type: "bonus", why: "Stand still and aim. Your next shot is far more likely to hit.", note: "Only if you haven't moved", tag: "buff" },
      { name: "Surge of Vigour", type: "bonus", why: "Second wind — heal yourself, or take an extra Dash, Disengage or Dodge.", dmg: "heal 1d8+7", uses: "1 per short rest", tag: "support" },
      { name: "White knives", type: "action", why: "Someone got close. Stab them.", atk: "+7", dmg: "1d6+4", tag: "attack" }
    ],
  gimli: [
      { name: "Battle axe", type: "action", why: "Swing the axe. You get two swings each turn.", atk: "+7", dmg: "1d8+5", note: "Two attacks per Action; 1d10+5 in two hands", tag: "attack" },
      { name: "Battle-Fury", type: "free", why: "Drop your guard and go berserk. You hit much harder and shrug off damage — but you're easier to hit back.", note: "Declare on your first attack", tag: "buff" },
      { name: "Baruk Khazâd!", type: "bonus", why: "Roar the dwarven war-cry. Enemies who hear it may be frightened of you.", note: "They resist with a DC 15 check", uses: "1 per short rest", tag: "control" },
      { name: "Surge of Vigour", type: "bonus", why: "Second wind — heal yourself, or take an extra Dash, Disengage or Dodge.", dmg: "heal 1d8+8", uses: "1 per short rest", tag: "support" },
      { name: "Throwing axes", type: "action", why: "Throw an axe at something out of reach.", atk: "+7", dmg: "1d6+4", range: "20 ft", tag: "attack" }
    ],
};

// Available to everyone, so no turn screen is ever empty.
export const COMMON_ACTIONS = [
    { name: "Move", type: "move", why: "Walk, run, climb. Your speed is on your sheet.", tag: "move" },
    { name: "Dash", type: "action", why: "Move again. Double your distance this turn.", tag: "move" },
    { name: "Disengage", type: "action", why: "Back away without anyone getting a free hit on you.", tag: "move" },
    { name: "Dodge", type: "action", why: "Focus entirely on not being hit. Attackers have a harder time.", tag: "defend" },
    { name: "Help", type: "action", why: "Assist a friend. Their next roll gets easier.", tag: "support" },
    { name: "Hide", type: "action", why: "Get out of sight. Attacking from hiding is much better.", tag: "move" }
  ];
