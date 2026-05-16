# SESSION_STATE.md — horrid-wake
_Last updated: 2026-05-15_

---

## 🚀 Cold Start Prompt

> Read this file top to bottom before doing anything.
> Current priority: **Fix #1 in Known Issues below.**
> Do not suggest architectural changes unless I ask.
> Do not create new files unless I ask — edit existing ones.
> If anything is ambiguous, ask ONE clarifying question, then proceed.

---

## What This Project Is

**horrid-wake** is a mobile-first multiplayer D&D web app for running an async AI-DM'd campaign over the summer, culminating in an in-person bachelor party one-shot in the fall.

- **Summer:** Lost Mines of Phandelver, played async over text like a group chat, AI DM powered by Groq
- **Fall:** Custom one-shot, same characters (leveled up to 5), in-person, gnoll warlord / Egyptian chaos aesthetic
- **Repo:** `github.com/kylo-ben/horrid-wake`
- **Deploy:** Vercel (auto-deploy on push to main)

---

## Stack

- Vanilla HTML/CSS/JS, ES modules, no bundler
- Firebase Realtime Database (configured, rules open until Nov 1 2026)
- Groq API — model: `llama-3.3-70b-versatile`, env var: `GROQ_API_KEY` (not GROQ_KEY)
- Vercel serverless functions — `api/*.js`, CommonJS `module.exports` format

---

## File Structure

```
/
├── index.html                  — character select shell
├── summer-camp.html            — THE main game screen (DM chat + combat)
├── app.js                      — entry point, imports all modules
├── services/
│   ├── characters.js           — CHARS, SHEETS, IDENTITY exports
│   ├── images.js               — CHAR_IMGS base64 data
│   ├── firebase.js             — Firebase init, sets window.firebaseDb
│   └── groq.js                 — callChatApi(), fetch to /api/dm
├── components/
│   ├── campfire.js             — ember canvas animation
│   ├── characterCard.js        — buildCards()
│   ├── detailPanel.js          — openDetail(), closeDetail(), enterDungeon()
│   └── diceRoller.js           — dice tray UI
├── screens/
│   ├── selectScreen.js         — character select logic
│   └── summerCamp.js           — DM chat + combat screen logic
├── styles/
│   ├── main.css
│   ├── cards.css
│   ├── detail.css
│   └── summerCamp.css
├── api/
│   └── dm.js                   — Groq serverless function (CommonJS)
├── js/
│   ├── dataEngine.js
│   ├── adventureState.js
│   └── partyState.js
└── vercel.json                 — minimal rewrites only, no legacy builds
```

---

## The Party

All from It's Always Sunny in Philadelphia. Level 1 for Summer Camp, level 5 for the bachelor party one-shot.

| ID | Name | Class | Key Stat |
|---|---|---|---|
| dennis | Dennis of House Reynolds | Sorcerer · Wild Magic | CHA 18 |
| mac | Mac the Unbroken | Paladin · Oath of Conquest | STR 16 |
| charlie | Charlie of the Below | Druid · Circle of Spores | WIS 18 |
| dee | Dee the Unbroken Bird | Bard · College of Eloquence | CHA 16 |
| frank | Frank the Undying | Barbarian · Path of the Beast | CON 18 |
| _(6th slot)_ | Character builder / TBD | TBD | — |

Full CHARS + SHEETS arrays live in `services/characters.js` and `index.html`.

---

## Firebase Config

- Project: `horrid-wake`
- Database URL: `https://horrid-wake-firebase-default-rtdb.firebaseio.com`
- Config lives in: `services/firebase.js` (hardcoded, recovered from git history)
- Rules: open read/write until Nov 1 2026
- SDK: Firebase compat 10.12.0 via CDN in `index.html`

### Data Structure

```
/sessions/lostmines/
  chat/                 — messages (push())
    {
      type: 'dm' | 'player',
      characterId: string,
      characterName: string,
      text: string,
      timestamp: number
    }
  state/
    thinking: boolean   — DM lock, prevents double-trigger
    phase: 'exploration' | 'combat'
  presence/
    {charId}: true      — join tracking
```

---

## Current Feature Status

### `index.html` — Character Select
- ✅ Campfire, ember particles, character cards, detail panel
- ✅ AI-generated character portraits (base64 embedded)
- ✅ Inline editable character names
- ✅ Custom grimdark confirmation overlay (no `alert()`)
- ✅ "Enter the Dungeon" → saves `{ playerId, characterId, characterName, portraitKey }` to localStorage → redirects to `summer-camp.html?character=<id>`
- ✅ Detail panel has exactly TWO buttons: **VIEW CHARACTER SHEET** and **SUMMER CAMP**

### `summer-camp.html` — Main Game Screen
- ✅ Loads and renders
- ✅ Reads `?character=` from URL param
- ✅ Calls `/api/dm` on load for opening scene (Triboar Trail ambush)
- ✅ `/api/dm` returning 200, Groq responding
- ✅ DM narration renders in chat log
- ✅ Player can type and receive DM responses
- ✅ Firebase multiplayer — `onValue` listener on `/sessions/lostmines/chat` syncs all players
- ✅ Layout gap fixed — messages fill screen, input bar pinned to bottom
- ✅ Character sheet drawer — portrait icon (top-right topbar), slides in from right, 4 swipeable panels: Ability Scores & Skills / Combat / Character / Spells. Dot indicators, swipe + edge-tap navigation. Frank and Mac show "No spells" state. Pulls from SHEETS level1 data + SHEET_EXTRA supplemental (race, background, alignment, personality, attacks).

### `api/dm.js` — Groq Serverless Function
- ✅ CommonJS format (`module.exports`)
- ✅ Uses `GROQ_API_KEY` env var
- ✅ Hardcoded system prompt server-side
- ✅ `max_tokens: 300` (enforces 2–3 sentence DM responses)
- System prompt persona: Matt Mercer on a deadline — terse, narrative, Always Sunny party bios, Lost Mines level 1, Triboar Trail opening

---

## Known Issues — Priority Order

1. **DM system prompt refinement** — seed with full LMoP content, party stat blocks, grimdark Frazetta tone, narrative dice rolling, responses under 150 words, no "what do you do?" prompts
2. **Combat system** — MTG Arena style turn economy:
   - Initiative roll (d20 + DEX mod, animated dice)
   - Movement (30ft tracker) → Action → Bonus Action → Free Action
   - Each slot grays out when used, END TURN button when done
   - DM resolves narratively, no grid
   - Triggered by `<COMBAT_START>` tag in Groq response
3. **Dice roller** — toggleable floating d20, tray with all dice types, animated roll
4. ~~**SHEET button** — slides up full character sheet overlay with all stats explained for new players~~ ✅ Done (2026-05-15)
5. **6th character slot** — guided builder: pick race/class, roll stats, name, saves to Firebase, locks in like others
6. **Progression gating** — key story beats require minimum N players to post before DM advances plot; casual chat flows freely

---

## Aesthetic Rules — Never Break These

- Background: `#1a1008`
- Gold accent: `#c8943a`
- Fonts: Cinzel (headings), IM Fell English (body/narrative)
- Mobile-first, full viewport always
- Grimdark / Frazetta — dark parchment, no bright gradients, ember glow only
- DM messages: full width, gold left border, italic
- Player messages: left-aligned, character name in accent color

---

## Architecture Decisions — Locked

- **No join codes.** Everyone hits the same URL. Party is hardcoded. URL is the session.
- **Character locked after select.** No swapping mid-campaign.
- **DM is automatic.** Responds after every player message. No manual trigger.
- **Character remembered via localStorage** after select. No re-selection on revisit.
- **Commit directly to main.** No branches/worktrees — Vercel deploys from main only.

---

## Claude Code Workflow Rules

- Always commit directly to `main` — never `gh pr create` (not authenticated)
- Always verify the fix landed on `main` before assuming it's deployed
- Deliver all code changes as Claude Code prompts, not inline suggestions
- `GROQ_API_KEY` is the correct env var name — not `GROQ_KEY`
