import { CHARS, SHEETS, ACTIONS } from '../services/characters.js';

// ── THE LOREMASTER ────────────────────────────────────────────
// A rules bot that runs entirely in the browser. No backend, no API key,
// no network call — which matters more than it sounds, because half the
// point is answering a question at a table with bad wifi and four beers in.
//
// The answer chain the table asked for:
//   1. The Lord of the Rings Roleplaying, where it differs from vanilla
//   2. 5th Edition, where LotR just uses the standard rule
//   3. "idk man" — and it says so rather than inventing something
//
// Every answer is written from scratch in plain English. None of it is
// lifted from either rulebook: game mechanics are not copyrightable, the
// text explaining them is, and this app is public.

// src: 'lotr' = specific to this ruleset · '5e' = standard 5th Edition
//      'table' = a call Ben made for this one-shot
const KB = [
  // ── TURN STRUCTURE ──────────────────────────────────────────
  { id: 'turn', src: '5e', t: 'What you get on your turn',
    q: ['what can i do on my turn', 'my turn', 'turn work', 'what do i do', 'options on my turn'],
    a: `Every turn you get <b>all four of these</b>, and they do not trade against each other:
    <ul>
      <li><b>One action</b> — the big thing. Attack, shove, help.</li>
      <li><b>One bonus action</b> — only if something on your sheet says "bonus action". You do not get one by default.</li>
      <li><b>Your movement</b> — split it however you like, before and after your action.</li>
      <li><b>Free stuff</b> — talking, dropping something, one quick interaction like drawing a sword.</li>
    </ul>
    You also get <b>one reaction</b>, but that happens on <i>other</i> people's turns.
    <br><br>Easiest thing: hit <b>MY TURN</b> on your sheet. It lists exactly what you can do and rolls it for you.` },

  { id: 'action', src: '5e', t: 'Action',
    q: ['action', 'regular action', 'standard action'],
    a: `The main thing you do on your turn. One per turn. Attacking, grappling, shoving, hiding, dashing — all actions.<br><br>If you are not sure whether something is an action, it probably is. You get one.` },

  { id: 'bonus', src: '5e', t: 'Bonus action',
    q: ['bonus action', 'bonus'],
    a: `A small extra thing on top of your action. <b>You only have one if something on your sheet explicitly says "bonus action"</b> — it is not a free slot everyone gets to improvise with.<br><br>One per turn, and you cannot trade your action in for a second one.` },

  { id: 'reaction', src: '5e', t: 'Reaction',
    q: ['reaction', 'react'],
    a: `One per <b>round</b>, and it happens on somebody else's turn — usually an opportunity attack when an enemy walks away from you.<br><br>It refreshes at the start of your next turn. Most rounds you will not use it, and that is fine.` },

  { id: 'move', src: '5e', t: 'Movement',
    q: ['move', 'movement', 'how far can i move', 'how fast', 'speed', 'walk', 'run'],
    a: `Your speed is on your sheet, in feet. Most people have 30; hobbits and dwarves have 25.<br><br>You can <b>split it around your action</b> — walk in, swing, walk out. You do not have to spend it all, and you do not have to spend it at once.<br><br>Taking the <b>Dash</b> action doubles it for that turn.` },

  { id: 'free', src: '5e', t: 'Free actions',
    q: ['free action', 'talk', 'shout', 'speak'],
    a: `Things that cost you nothing: talking, shouting a warning, dropping something, letting go of a rope.<br><br>You also get <b>one free object interaction</b> per turn — drawing a weapon, opening a door, picking something up. A second one in the same turn costs your action.` },

  // ── ROLLING ─────────────────────────────────────────────────
  { id: 'attack', src: '5e', t: 'How attacking works',
    q: ['how do i attack', 'what do i roll to hit', 'attack roll', 'do i hit', 'roll to hit'],
    a: `Two rolls:
    <ol>
      <li><b>Did it land?</b> Roll a d20, add your attack bonus. If it beats the target's Armour Class, you hit.</li>
      <li><b>How bad?</b> Roll the damage dice listed next to the attack.</li>
    </ol>
    <b>You do not need to do any of this by hand.</b> Open your sheet, hit MY TURN, tap the attack — it rolls both and tells you the numbers.` },

  { id: 'd20', src: '5e', t: 'The dice',
    q: ['d20', 'what dice', 'which dice', 'what do the dice mean', 'd8', 'd6', 'd10', 'd12'],
    a: `The number after the <b>d</b> is how many sides. A d20 is the big twenty-sided one; a d8 has eight sides.<br><br><b>2d6</b> means roll two six-sided dice and add them together. <b>1d8+4</b> means roll one eight-sider and add four.<br><br>Nearly everything that can succeed or fail uses the <b>d20</b>. The little dice are almost always damage.` },

  { id: 'adv', src: '5e', t: 'Advantage and disadvantage',
    q: ['advantage', 'disadvantage', 'adv', 'roll twice', 'two dice'],
    a: `<b>Advantage</b> — roll two d20s, keep the higher. Something is going your way.<br><b>Disadvantage</b> — roll two, keep the lower. Something is against you.<br><br>They do not stack. One of each cancels out and you roll normally, no matter how many of each you have.<br><br>All four hobbits have advantage on <b>Wisdom saves</b>, which is why their sheet says ADV there.` },

  { id: 'crit', src: '5e', t: 'Critical hits',
    q: ['crit', 'critical', 'nat 20', 'natural 20', 'nat 1', 'natural 1', 'twenty'],
    a: `Roll a <b>natural 20</b> on an attack — the die itself, before adding anything — and you hit no matter what, and you <b>roll all your damage dice twice</b>. Bonuses are only added once.<br><br>A <b>natural 1</b> on an attack always misses. It is not an automatic disaster, it is just a miss.<br><br>Frodo crits on a <b>19 or 20</b> — Sting is keen.<br><br>Natural 20s and 1s only matter on attacks and death saves. On a skill check they are just a high or low number.` },

  { id: 'save', src: '5e', t: 'Saving throws',
    q: ['saving throw', 'save', 'saves', 'resist'],
    a: `A roll to <b>avoid</b> something happening to you — diving out of the way, shrugging off fear, not getting knocked flat.<br><br>The DM says which one: "Dexterity save." Roll a d20, add the number on your sheet next to that ability, say the total.<br><br>A filled dot means you are trained in it and your proficiency is already included. You do not add anything extra.` },

  { id: 'check', src: '5e', t: 'Skill checks and DCs',
    q: ['skill check', 'check', 'dc', 'difficulty', 'do i succeed', 'how hard'],
    a: `Roll a d20, add the skill's number, beat the DM's target number. He may not tell you the target; that is normal.<br><br>Rough scale: <b>10</b> is something an ordinary person manages on a good day, <b>15</b> takes real skill, <b>20</b> is genuinely hard.<br><br>If you are not trained in it you can still try — you just add your raw ability modifier instead.` },

  { id: 'init', src: '5e', t: 'Initiative',
    q: ['initiative', 'turn order', 'who goes first', 'what order'],
    a: `At the start of a fight everyone rolls a d20 and adds their <b>Dexterity</b> modifier. Highest goes first, and that order holds for the whole fight.<br><br>Roll it once. Nobody rerolls it later.` },

  // ── DAMAGE, HEALING, DYING ──────────────────────────────────
  { id: 'hp', src: '5e', t: 'Hit points',
    q: ['hp', 'hit points', 'health', 'how much health'],
    a: `How much punishment you can take before you drop. It goes down when you get hit and comes back when you rest or someone patches you up.<br><br>Track it in <b>MY TURN</b> — the plus and minus buttons either side of the number.<br><br>Losing hit points is not injury exactly. It is closer to running out of luck, breath and near-misses.` },

  { id: 'ac', src: '5e', t: 'Armour Class',
    q: ['ac', 'armour class', 'armor class', 'how hard to hit', 'defence', 'defense'],
    a: `How hard you are to hit. Anyone attacking you rolls a d20, adds their bonus, and needs to <b>meet or beat</b> your AC.<br><br>It never changes mid-fight unless something specifically says so. It is armour, shield and how well you move, rolled into one number.` },

  { id: 'dying', src: '5e', t: 'Going down and death saves',
    q: ['dying', 'death save', 'death saves', 'zero hp', '0 hp', 'hit 0', 'drop to 0', 'go down', 'went down', 'bleeding out', 'stabilise', 'stabilize', 'unconscious', 'do i die', 'knocked out', 'dead'],
    a: `At <b>0 hit points</b> you fall unconscious. You are not dead.<br><br>On each of your turns you roll a plain d20, no bonus:
    <ul><li><b>10 or higher</b> — one success</li><li><b>9 or lower</b> — one failure</li>
    <li><b>Natural 20</b> — you wake up on 1 hit point</li><li><b>Natural 1</b> — counts as two failures</li></ul>
    <b>Three successes</b> and you are stable. <b>Three failures</b> and you are gone.<br><br>Any healing at all, even 1 point, puts you straight back up and wipes the tally. Somebody using their action to stabilise you also stops the clock.` },

  { id: 'heal', src: '5e', t: 'Healing',
    q: ['heal', 'healing', 'potion', 'get health back', 'restore hp', 'bandage'],
    a: `Three ways:
    <ul><li><b>A healing potion</b> — an action to drink, and it is instant.</li>
    <li><b>A short rest</b> — spend your hit dice.</li>
    <li><b>A long rest</b> — everything back.</li></ul>
    Nobody in this fellowship is a dedicated healer, so potions and not getting hit are the plan.` },

  { id: 'rest', src: '5e', t: 'Short and long rests',
    q: ['rest', 'short rest', 'long rest', 'hit dice', 'catch my breath'],
    a: `<b>Short rest</b> — about an hour. Spend hit dice to heal: roll the die on your sheet, add your Constitution modifier, get that back. You choose how many to burn.<br><br><b>Long rest</b> — a night. All hit points back, half your hit dice back, and anything that recharges "per day" comes back.<br><br>In a one-shot you will probably get one short rest if you are lucky. Spend accordingly.` },

  // ── COMBAT MOVES ────────────────────────────────────────────
  { id: 'ooa', src: '5e', t: 'Opportunity attacks',
    q: ['opportunity attack', 'walk away', 'free attack', 'disengage', 'run away', 'leave melee'],
    a: `If an enemy is next to you and <b>walks away</b>, you get a free swing at them using your reaction. That works both ways — walk away from an orc and it gets one on you.<br><br>Two ways to leave safely: take the <b>Disengage</b> action, or make them unable to react.<br><br>It only triggers on <i>walking</i> away. Being shoved, teleported, or moved by someone else does not set it off.` },

  { id: 'commonact', src: '5e', t: 'Things anyone can do',
    q: ['dodge', 'dash', 'help', 'hide', 'shove', 'grapple', 'improvise', 'what else can i do'],
    a: `You do not need it on your sheet to try it. Anyone can use their action to:
    <ul><li><b>Dodge</b> — everyone attacking you has disadvantage until your next turn. Genuinely strong when you are nearly down.</li>
    <li><b>Dash</b> — double your movement.</li>
    <li><b>Disengage</b> — walk away without giving up free hits.</li>
    <li><b>Help</b> — give an ally advantage on their next roll. The best thing a player with nothing to do can do.</li>
    <li><b>Hide</b> — Stealth check, if there is anywhere to hide.</li>
    <li><b>Shove</b> — knock someone prone or push them 5 feet.</li></ul>
    And beyond that: describe what you want and let the DM tell you what to roll. That is the actual game.` },

  { id: 'prone', src: '5e', t: 'Prone',
    q: ['prone', 'knocked down', 'on the ground', 'get up', 'stand up'],
    a: `Flat on your back. Attacks against you from <b>next to you</b> have advantage; attacks from <b>range</b> have disadvantage. Your own attacks have disadvantage.<br><br>Standing up costs <b>half your movement</b> and no action.<br><br>Knocking an orc prone before the big hitter swings is one of the best things a small character can do.` },

  { id: 'range', src: '5e', t: 'Shooting in melee',
    q: ['ranged attack in melee', 'shoot in melee', 'bow up close', 'shoot while next to'],
    a: `You can, but you have <b>disadvantage</b> if a conscious enemy is within 5 feet of you.<br><br>Legolas has knives for exactly this reason.` },

  { id: 'cover', src: '5e', t: 'Cover',
    q: ['cover', 'behind a rock', 'hiding behind', 'obstacle'],
    a: `Something solid between you and the shooter:
    <ul><li><b>Half cover</b> (a low wall, another creature) — <b>+2</b> to AC and Dex saves</li>
    <li><b>Three-quarters</b> (an arrow slit, a tree trunk) — <b>+5</b></li>
    <li><b>Total</b> — cannot be targeted at all</li></ul>
    Worth saying out loud when you move. The DM will not always spot it for you.` },

  { id: 'twf', src: '5e', t: 'Fighting with two weapons',
    q: ['two weapons', 'dual wield', 'off hand', 'second weapon'],
    a: `Attack with a light weapon in one hand, then use your <b>bonus action</b> to swing the other one. The off-hand swing does not add your ability modifier to damage unless something says it does.<br><br>If it is on your sheet, MY TURN already has it costed correctly.` },

  // ── LOTR-SPECIFIC ───────────────────────────────────────────
  { id: 'culture', src: 'lotr', t: 'Culture, not race',
    q: ['culture', 'race', 'what culture am i', 'hobbit', 'dwarf', 'elf', 'subculture'],
    a: `This game says <b>culture</b> where most fantasy games say race — where your folk are from and how they were raised, not what species you are. Barding, Shire-hobbit, Elf of Lindon, Dwarf of Durin's folk.<br><br>It carries your languages, your standard of living, and a couple of traits. It is on your sheet under <b>Background</b>.<br><br>Mechanically it does the same job as a race. The name is doing thematic work.` },

  { id: 'calling', src: 'lotr', t: 'Calling, not class',
    q: ['calling', 'class', 'what class am i', 'warden', 'scholar', 'slayer', 'treasure hunter', 'captain', 'wanderer', 'spells', 'magic', 'cast'],
    a: `<b>Calling</b> is this game's word for class — why you left home, not what job you clock into. Warrior, Scholar, Slayer, Captain, Treasure Hunter, Wanderer.<br><br>It sets your hit die, your saves, and the features on your sheet. Yours is under your name at the top.<br><br>There are <b>no wizards and no spells</b>. Nobody in this party casts anything, and that is deliberate — magic in Middle-earth is rare, old and mostly not yours.` },

  { id: 'fellowship', src: 'lotr', t: 'Fellowship points',
    q: ['fellowship', 'fellowship point', 'inspiration', 'reroll', 'lean on the party'],
    a: `The party shares a pool of <b>Fellowship points</b>. Spend one to reroll a d20, or to get back on your feet when the road has ground you down.<br><br>You earn them by leaning on each other — playing your bonds, backing someone up, doing the thing your character would do rather than the optimal thing.<br><br>It is this game's version of Inspiration, made a group resource instead of a personal one. Ask the DM how many the table has.` },

  { id: 'shadow', src: 'table', t: 'Shadow',
    q: ['shadow', 'corruption', 'shadow points', 'miserable', 'despair'],
    a: `<b>Not in this game.</b> The full ruleset has a Shadow track — dread and corruption creeping in over a long campaign, eventually breaking your character.<br><br>Ben cut it. It is a one-shot, it is a bachelor party, and nobody wants a spreadsheet about despair while crushing beers.<br><br>If the DM describes something horrifying, just roleplay being horrified. No tracking.` },

  { id: 'virtue', src: 'lotr', t: 'Virtues and rewards',
    q: ['virtue', 'virtues', 'reward', 'rewards', 'special ability', 'magic item'],
    a: `<b>Virtues</b> are things you learned — a trick, a knack, a bit of inherited wisdom.<br><b>Rewards</b> are things you carry — heirloom gear, a better blade, armour that has been in the family.<br><br>Together they are this game's answer to feats and magic items, and they are why two Warriors do not play the same.<br><br>Yours are on your sheet under <b>Virtues &amp; Rewards</b>. Tap any of them for what it actually does.` },

  { id: 'hobbitsense', src: 'lotr', t: 'Hobbit-Sense',
    q: ['hobbit sense', 'why do hobbits have adv', 'why does it say adv', 'adv on wisdom'],
    a: `All four hobbits have <b>advantage on Wisdom saving throws</b>. Roll two d20s, keep the better one.<br><br>Hobbits are famously hard to frighten, trick or talk into something stupid. It is the single most useful thing about being small.` },

  { id: 'skills', src: 'lotr', t: 'The odd-sounding skills',
    q: ['old lore', 'riddle', 'explore', 'hunting', 'travel', 'awareness', 'weird skills', 'skill names'],
    a: `This ruleset renames some skills to fit Middle-earth:
    <ul><li><b>Old Lore</b> — history, legend, "have I heard of this thing"</li>
    <li><b>Riddle</b> — puzzles, reading people, working out what someone is not saying</li>
    <li><b>Explore</b> — reading terrain, finding the way, surviving outdoors</li>
    <li><b>Hunting</b> — tracking, stalking, feeding the party</li>
    <li><b>Travel</b> — enduring the road</li>
    <li><b>Awareness</b> — noticing things</li></ul>
    They work exactly like any other skill: d20, add the number, beat the target.` },

  { id: 'level', src: 'table', t: 'Levelling up',
    q: ['level up', 'levelling', 'leveling', 'xp', 'experience points', 'what level am i', 'gain a level'],
    a: `You do not. Everyone starts and finishes at <b>level 5</b>, and there is no experience to track.<br><br>It is one night. Levelling exists so a campaign has a shape over months; this has a shape over about four hours.<br><br>Level 5 is deliberate &mdash; it is the point where every character has enough tricks to feel like themselves without needing a manual.` },

  { id: 'prof', src: '5e', t: 'Proficiency bonus',
    q: ['proficiency', 'prof', 'proficient', 'trained', 'what does trained mean', 'whats the plus 3 for'],
    a: `Your training bonus. At level 5 everybody's is <b>+3</b>.<br><br>You add it to anything you are trained in &mdash; certain saves, certain skills, and your weapon attacks. <b>It is already baked into every number on your sheet</b>, so you never add it yourself.<br><br>The filled dots next to your saves are just telling you where it went.` },

  { id: 'role', src: 'table', t: 'What your character is for',
    q: ['what am i good at', 'whats my job', 'my role', 'what do i do in a fight', 'am i any good', 'what is my character for'],
    a: `Every sheet has a one-line answer to this right under the name &mdash; the plain-English version of what you are there to do.<br><br>Roughly: <b>Boromir and Gimli</b> stand in front. <b>Legolas</b> kills things from range. <b>Aragorn</b> does a bit of everything and keeps people alive. <b>Frodo and Sam</b> are quick and hard to pin down. <b>Merry and Pippin</b> cause problems.<br><br>None of it is binding. Do the funny thing.` },

  { id: 'cond', src: '5e', t: 'Frightened, poisoned and the rest',
    q: ['frightened', 'condition', 'conditions', 'poisoned', 'stunned', 'paralysed', 'paralyzed', 'restrained', 'blinded', 'grappled'],
    a: `Conditions are short-hand for "something is wrong with you". The common ones:
    <ul><li><b>Frightened</b> — disadvantage while you can see the thing, and you cannot move closer to it</li>
    <li><b>Poisoned</b> — disadvantage on attacks and checks</li>
    <li><b>Restrained / Grappled</b> — you cannot move; restrained also gives you disadvantage and attackers advantage</li>
    <li><b>Blinded</b> — you attack with disadvantage, everyone attacks you with advantage</li>
    <li><b>Stunned / Paralysed</b> — you lose your turn. Paralysed is worse: hits from next to you crit automatically</li></ul>
    If the DM says one of these at you, just ask him what it stops you doing. That is a normal question.` },

  // ── APP / TABLE ─────────────────────────────────────────────
  { id: 'app', src: 'table', t: 'Using this app',
    q: ['how do i use this', 'how does this work', 'what is this app', 'help'],
    a: `<ul><li>Tap a face to open that character's sheet.</li>
    <li><b>Everything on the sheet is tappable</b> — every number, every trait. Tap it for what it means.</li>
    <li><b>MY TURN</b> is the one that matters in a fight. It tracks your health, shows what you can do, and rolls all the dice for you.</li>
    <li><b>PRINT</b> gives you a paper sheet.</li>
    <li><b>THE MISSION</b> is what you know going in.</li></ul>
    Nothing syncs between phones. Your app is yours.` },

  { id: 'dibs', src: 'table', t: 'Claiming a character',
    q: ['dibs', 'claim', 'pick a character', 'which one is mine', 'who do i play', 'taken'],
    a: `Call it in the group chat. The app shows who has claimed what, but it does not lock anything — there is no login and no server, so it runs on trust and shouting.<br><br>If two of you want Aragorn, roll for it. You have dice.` },

  { id: 'math', src: 'table', t: 'Do I have to do maths',
    q: ['math', 'maths', 'do i need to add', 'never played', 'first time', 'new player', 'confused', 'bad at this'],
    a: `No. That is the entire reason this app exists.<br><br>Every number on your sheet already has everything added into it. When the DM says "roll Perception", you find the number and add it. That is the whole job.<br><br>In a fight, hit <b>MY TURN</b> and tap what you want to do — it rolls the dice, does the sums, and tells you the result in a sentence.<br><br>Your actual job is deciding what your character does. Nobody at that table cares if you get a rule wrong.` },
];

// ── MATCHER ───────────────────────────────────────────────────
// Deliberately dumb and deliberately transparent: score each entry by how
// much of its phrasing the question actually contains, and refuse to answer
// below a threshold. A confident wrong answer at a table is worse than
// "idk man", because nobody double-checks the confident one.

const STOP = new Set(['a', 'an', 'the', 'is', 'are', 'do', 'does', 'i', 'you', 'my', 'me', 'what', 'how', 'can', 'if', 'it', 'to', 'of', 'on', 'in', 'for', 'and', 'or', 'was', 'with', 'that', 'this', 'when', 'who', 'get', 'got', 'have', 'has', 'be', 'am', 'so', 'but', 'at', 'they', 'them', 'we']);

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const words = s => norm(s).split(' ').filter(w => w && !STOP.has(w));

function score(question, entry) {
  const qn = norm(question);
  const qw = words(question);
  if (!qw.length) return 0;
  let best = 0;

  for (const phrase of entry.q) {
    const pn = norm(phrase);
    // whole phrase present — near-certain match
    if (qn.includes(pn)) { best = Math.max(best, 10 + pn.length / 4); continue; }
    // Stripping stopwords from a short phrase can leave a single generic
    // token -- "what do i do in a fight" collapses to [fight], which then
    // matched "what monsters are we fighting". Keep every word when that
    // happens, and compare against the unstripped question to match.
    let pw = words(phrase), qc = qw;
    if (pw.length < 2) { pw = pn.split(" ").filter(Boolean); qc = qn.split(" ").filter(Boolean); }
    if (!pw.length || !pw.some(w => !STOP.has(w))) continue;
    const hits = pw.filter(w => qc.some(x => x === w
      || (x.length > 4 && w.startsWith(x)) || (w.length > 4 && x.startsWith(w))));
    // A short phrase has to match in full. Half of a two-word phrase is noise.
    const need = pw.length <= 2 ? pw.length : Math.max(2, Math.ceil(pw.length * 0.6));
    if (hits.length >= need) best = Math.max(best, (hits.length / pw.length) * 4 + hits.length);
  }
  // The title carries weight too, so "critical hits" finds the crit entry --
  // but only as a tie-breaker. Letting it stack on top of an exact phrase hit
  // let "what happens if i hit 0 hp" land on Hit Points, because that title
  // happens to contain the word "hit".
  if (best < 10) for (const w of words(entry.t)) if (qw.includes(w)) best += 0.8;
  return best;
}

const SRC_LABEL = { lotr: 'LotR Roleplaying', '5e': '5th Edition', table: "Ben's call", you: 'Your sheet' };

// Character-specific lookups, so "what's my AC" beats the generic AC answer
// whenever a sheet is actually open.
function personal(question) {
  const id = window.activeId;
  if (!id || !SHEETS[id]) return null;
  const s = SHEETS[id];
  const c = CHARS.find(x => x.id === id);
  const qn = norm(question);
  if (!/\b(my|i|im|me)\b/.test(qn) && !qn.includes(norm(c.short))) return null;

  if (/\bac\b|armou?r class/.test(qn))
    return [`${c.short}'s AC`, `<b>${s.ac}</b>. Anything attacking you needs a d20 total of ${s.ac} or higher to land.`];
  if (/\bhp\b|health|hit points/.test(qn))
    return [`${c.short}'s health`, `<b>${s.hp}</b> hit points, and a <b>${s.hitDie}</b> hit die to spend on a short rest.`];
  if (/speed|how far|how fast/.test(qn))
    return [`${c.short}'s speed`, `<b>${s.speed} feet</b> per turn. You can split it before and after your action.`];
  if (/what can i do|my attacks|my options|what do i do|my turn/.test(qn)) {
    const acts = ACTIONS[id] || [];
    return [`${c.short} — what you can do`,
      acts.map(a => `<b>${a.name}</b> <span class="lm-cost">${a.type}</span>`
        + (a.atk ? ` — to hit ${a.atk}${a.dmg ? `, damage ${a.dmg}` : ''}` : '')).join('<br>')
      + `<br><br>Hit <b>MY TURN</b> and it rolls any of these for you.`];
  }
  return null;
}

function answer(question) {
  const p = personal(question);
  if (p) return { t: p[0], a: p[1], src: 'you' };

  const ranked = KB.map(e => ({ e, s: score(question, e) })).sort((a, b) => b.s - a.s);
  const top = ranked[0];
  if (!top || top.s < 3.5) return null;

  // LotR wins ties — the fallback order the table asked for. Only kicks in
  // when a LotR entry is genuinely neck-and-neck, not when 5e is clearly better.
  const rival = ranked.find(r => r.e.src === 'lotr' && top.s - r.s < 0.9);
  const pick = (rival && top.e.src !== 'lotr') ? rival.e : top.e;
  return { t: pick.t, a: pick.a, src: pick.src };
}

// ── UI ────────────────────────────────────────────────────────

const SUGGEST = [
  'What can I do on my turn?',
  'How do I attack?',
  'What is a bonus action?',
  'What happens at 0 HP?',
  'What is advantage?',
  'What is a calling?',
];

let log = null;

function bubble(who, html, meta) {
  const el = document.createElement('div');
  el.className = `lm-msg lm-${who}`;
  el.innerHTML = (meta ? `<div class="lm-meta">${meta}</div>` : '') + html;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

function ask(question) {
  const q = question.trim();
  if (!q) return;
  bubble('you', q.replace(/</g, '&lt;'));
  document.getElementById('lmSuggest').hidden = true;

  const r = answer(q);
  // a beat before answering — an instant reply reads as canned
  setTimeout(() => {
    if (!r) {
      bubble('wiz', `idk man.<br><br>That one is not in my book. Ask the DM &mdash; he gets to make it up, and whatever he says is the rule.`);
    } else {
      bubble('wiz', r.a, `${r.t} <span class="lm-src lm-src-${r.src}">${SRC_LABEL[r.src]}</span>`);
    }
  }, 260);
}

export function initLoremaster() {
  const view = document.getElementById('loremasterView');
  log = document.getElementById('lmLog');
  const input = document.getElementById('lmInput');

  const open = () => {
    view.classList.add('open');
    setTimeout(() => input.focus(), 320);
  };
  const close = () => { view.classList.remove('open'); input.blur(); };

  document.getElementById('lmFab').addEventListener('click', open);
  document.getElementById('lmClose').addEventListener('click', close);

  const send = () => { ask(input.value); input.value = ''; };
  document.getElementById('lmSend').addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });

  const sug = document.getElementById('lmSuggest');
  sug.innerHTML = SUGGEST.map(s => `<button class="lm-chip" type="button">${s}</button>`).join('');
  sug.addEventListener('click', e => {
    const b = e.target.closest('.lm-chip');
    if (b) ask(b.textContent);
  });

  bubble('wiz', `I know the rules so you do not have to.<br><br>Ask me anything &mdash; how attacking works, what a bonus action is, what happens when you hit zero. If it is not in my book I will say so rather than make it up.`);
}
