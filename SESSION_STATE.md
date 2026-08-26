# SESSION_STATE.md — horrid-wake
_Last updated: 2026-08-26 (session 4)_

---

## 🚀 Cold Start Prompt

> Read this file top to bottom before doing anything.
> Current priority: **Known Issues #1 and #2 — real LotR 5e stat blocks + Fellowship portrait art. Both are blocked on Ben; see the questions there.**
> The AI-DM game stack has been stripped (2026-08-26). This repo is now ONLY the character-select app.
> Do not suggest architectural changes unless I ask.
> Do not create new files unless I ask — edit existing ones.
> If anything is ambiguous, ask ONE clarifying question, then proceed.

---

## What This Project Is

**horrid-wake** is a mobile-first multiplayer D&D web app for running an async AI-DM'd campaign over the summer, culminating in an in-person bachelor party one-shot in the fall.

- **Summer:** Lost Mines of Phandelver, played async over text like a group chat, AI DM powered by Groq
- **Fall (SCOPE CHANGED 2026-08-26):** In-person bachelor-party one-shot. Cast is now the **Tolkien Fellowship at level 5**, not the Always Sunny gang. Ben DMs in person; Gandalf is an NPC he voices, not a playable slot. **No AI DM and no combat engine for the one-shot.** horrid-wake's only job for the fall is a character-select screen where 6 players review their pre-built character and ask rules questions (rules assist lives in the separate `sages-tome` repo).
- **Repo:** `github.com/kylo-ben/horrid-wake`
- **Deploy:** Vercel (auto-deploy on push to main)

---

## Stack

- Vanilla HTML/CSS/JS, ES modules, no bundler
- No backend, no database, no API keys, no serverless functions — fully static as of 2026-08-26
- ~~Firebase Realtime Database~~ / ~~Groq API~~ / ~~Vercel serverless functions~~ — all removed with the AI-DM stack

---

## File Structure

```
/
├── index.html                  — the whole app: select screen + detail panel + sheet
├── app.js                      — entry point
├── components/
│   ├── campfire.js             — ember canvas animation
│   ├── characterCard.js        — buildCards()
│   ├── characterSheet.js       — openSheet/closeSheet/setSheetLevel/renderSheet
│   ├── detailPanel.js          — openDetail(), closeDetail()
│   └── diceRoller.js           — no-op stub (see Known Issues #6)
├── screens/
│   └── selectScreen.js         — init()
├── services/
│   ├── characters.js           — CHARS, SHEETS, IDENTITY, PRIMARY_STAT
│   ├── images.js               — CHAR_IMGS base64 (STALE — Always Sunny keys only)
│   └── dice.js                 — orphaned pure utility (see Known Issues #6)
├── styles/
│   ├── main.css
│   ├── cards.css
│   ├── detail.css
│   └── sheet.css
└── vercel.json                 — cleanUrls only
```

---

## The Party

All from It's Always Sunny in Philadelphia. Level 1 for Summer Camp, level 5 for the bachelor party one-shot.

| ID | Name | Class | Key Stat |
|---|---|---|---|
| aragorn | Aragorn, Son of Arathorn | Ranger · Dúnedain Wanderer | WIS 16 |
| legolas | Legolas Greenleaf | Ranger · Woodland Marksman | DEX 20 |
| gimli | Gimli, son of Glóin | Barbarian · Path of the Berserker | STR 18 |
| boromir | Boromir of Gondor | Fighter · Champion | STR 18 |
| merry | Meriadoc Brandybuck | Rogue · Scout | DEX 18 |
| pippin | Peregrin Took | Bard · College of Valor | CHA 18 |
| forge-your-own | Forge Your Own (`isCustom`, non-selectable) | — | — |

WARNING: **These stat blocks are PLACEHOLDER** - hand-built from general 5e knowledge, not the official LotR ruleset. See Known Issues #1.

Full CHARS + SHEETS arrays live in `services/characters.js` and `index.html`.

---

## Removed 2026-08-26 — the AI-DM stack

Deleted wholesale when the fall scope changed. All recoverable from git history (parent of the strip commit).

- `api/dm.js`, `services/groq.js`, `services/combat.js`, `services/firebase.js`
- `data/` — `bestiary-mm.json` (1.5MB), `lmop.json` (344KB), `enemies.js`
- `js/dataEngine.js`, `js/adventureState.js`, `js/partyState.js`, `js/dataTest.js`
- `screens/summerCamp.js`, `styles/summerCamp.css`, `summer-camp.html`, `sprites/`
- `#summerCampView` + `#adventureView` markup and the Firebase CDN tags in `index.html`
- `optimize_images.py` — was stale anyway (pointed at `OneDrive/Desktop/old docs/`, patched a `window.CHAR_IMGS` block that no longer exists). **Needs rewriting before portrait art can be embedded — see Known Issues #2.**
- `enterGroupChat()` in `detailPanel.js` — redirected to a `chat.html` that was never committed

The character sheet was extracted out of `screens/summerCamp.js` (lines 4–104, self-contained, no game-stack imports) into `components/characterSheet.js` before the delete, and the `.sh-*` rules out of `summerCamp.css` (lines 392–535) into `styles/sheet.css`.

**Firebase is gone.** The RTDB project still exists but nothing reads or writes it. No multiplayer, no presence, no shared state — the fall one-shot is in-person and needs none of it.

---

## Current Feature Status

### `index.html` — Character Select
- ✅ Campfire, ember particles, character cards, detail panel
- ✅ Retitled "The Fellowship Answers the Call"
- ✅ Fellowship roster (6 members + `forge-your-own`) replaces the Always Sunny gang in `services/characters.js`
- ✅ `forge-your-own` card hides `#dCtas`, shows `#dCustomMsg`, disables name editing
- ✅ Detail-panel CTA rewired: **VIEW CHARACTER SHEET** → `openSheet(activeId)` (was the dead `summer-camp.html?character=` game-engine link). Verified in-browser: sheet opens and renders for all 6.
- ❌ **Portraits are blank** — `services/images.js` still only holds the 5 Always Sunny base64 keys, so all 7 Fellowship cards render `url("")`. See Known Issues #2.
- ✅ Inline editable character names
- ✅ Custom grimdark confirmation overlay (no `alert()`)
- ✅ "Enter the Dungeon" → saves `{ playerId, characterId, characterName, portraitKey }` to localStorage → redirects to `summer-camp.html?character=<id>`
- ✅ Detail panel has exactly TWO buttons: **VIEW CHARACTER SHEET** and **SUMMER CAMP**

_(The `summer-camp.html` and `api/dm.js` sections were removed — see "Removed 2026-08-26" above.)_

---

## Known Issues — Priority Order

1. **Fellowship stat blocks are placeholder — BLOCKED ON BEN.** The handoff said to rebuild `SHEETS`/`CHARS` from the official LotR 5e sourcebook via Ben's 5e.tools repo. That repo is at `repos/5etools-src` — **but it contains no Middle-earth/LotR content at all.** It's vanilla 5etools; `homebrew/` holds only an `index.json`, and grepping `data/` for Tolkien/Middle-earth/Rings returns nothing but false positives ("Arcadian Springs" etc.). *Question for Ben: which book/ruleset is this actually, and where does its data live?*
2. **No Fellowship portrait art — BLOCKED ON BEN.** `imgKey`s `aragorn|legolas|gimli|boromir|merry|pippin|forge` resolve to nothing. This is copyrighted-character art; do NOT AI-generate movie likenesses. Ben must source/commission or supply art. Until then the select screen is 7 blank cards — a visible regression vs. the currently-deployed Always Sunny build.
3. **Sage's Tome integration undecided** — `github.com/kylo-ben/sages-tome` should surface in this app for rules help (half the party is new to D&D, the other half new to the LotR ruleset). Link-out vs. new tab vs. `<iframe>` is undecided, and the repo's deploy status is unknown (its own SESSION_STATE last reported an invalid Groq key + not deployed, but that note is stale).
4. **Sheet level toggle is now meaningless** — the sheet still offers LEVEL 1 / LEVEL 5, but every Fellowship `level1` block is a byte-for-byte copy of its `level5` block (level-5 one-shot, no progression). Either write real level-1 blocks or hide the toggle.
5. ~~**Old game infrastructure is dead weight**~~ ✅ Done 2026-08-26 — stripped. See "Removed 2026-08-26" above. Verified in-browser afterward: 13 requests all 200, no 404s, no console errors, select → detail → sheet → level toggle all working.
6. **Two dice modules left dangling, deliberately** — `services/dice.js` (33-line pure roller) is now imported by nothing, and `components/diceRoller.js` is a no-op stub whose comment still claims "dice rolling is handled invisibly by the DM AI." Both were left in place because a dice tray was an old backlog item; delete them if it isn't coming back.
7. **Progression gating / 6th-slot builder / combat system** — all obsolete for the fall one-shot per the scope change. Retained here only in case the summer campaign is revived.

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
- **No AI DM, no combat engine, no multiplayer backend.** Scope change 2026-08-26; the stack for all three was deleted, not disabled.

---

## Claude Code Workflow Rules

- Always commit directly to `main` — never `gh pr create` (not authenticated)
- Always verify the fix landed on `main` before assuming it's deployed
- Deliver all code changes as Claude Code prompts, not inline suggestions
