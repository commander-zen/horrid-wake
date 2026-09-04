# SESSION_STATE.md — horrid-wake
_Last updated: 2026-09-04 (session 6)_

---

## 🚀 Cold Start Prompt

> Read this file top to bottom before doing anything.
> Current priority: **Verify the ~60 derived combat numbers in `ACTIONS` (services/characters.js). They were reasoned out from the level-5 builds, not transcribed from the book, and nothing has checked them against the printable yet. After that: seed the remaining dibs in `KNOWN_DIBS` -- the app still tells the group "7 still open".**
> The AI-DM game stack has been stripped (2026-08-26). This repo is now ONLY the character-select app.
> Do not suggest architectural changes unless I ask.
> Do not create new files unless I ask — edit existing ones.
> If anything is ambiguous, ask ONE clarifying question, then proceed.

---

## Combat mode (added 2026-08-29)

Per-player only; nothing syncs between phones, by design. Entry is the **MY TURN**
button on the character sheet. A turn is presented as a budget -- Action / Bonus /
Move / Reaction -- each greying out when spent, so a first-time player never has to
know the vocabulary. The app rolls and adds; the player narrates.

`ACTIONS` in `services/characters.js` holds ~5 abilities per hero plus 6 universal
ones. **These are DERIVED from the level-5 builds, not transcribed from the book** --
attack bonus = ability mod + proficiency (+3), damage = weapon die + mod, plus reward
and fighting-style bonuses. Verify before play.

DIBS: in-app claims are localStorage, so per-device. `KNOWN_DIBS` seeds claims
everyone should see (Logan holds Aragorn). Ben can seed the rest rather than adding
a backend.

---

## ⚠️ Unpushed work — read first

**The repo moved off OneDrive on 2026-08-29.** Working copy is now:

```
C:/repos/horrid-wake          <- USE THIS
~/OneDrive/Desktop/repos/horrid-wake   <- scrap, .git is damaged, delete when convinced
```

**Four commits are committed locally and NOT on GitHub:**

| commit | what |
|---|---|
| `4f15f60` | retitle to "The Gang Fights a Balrog" + IASIP title card |
| `6cb13d2` | HELIX reskin (magikdex design language) |
| `c501130` | a11y: legible type, 44px targets, progressive disclosure |
| _this one_ | session state |

**Why they are stuck:** `git push` needs GitHub credentials. The credential
helper can only raise its prompt in a real interactive terminal, so from an
agent shell it hangs silently forever with no output and no error — `fetch`,
`clone` and `ls-remote` all work because those are anonymous reads on a public
repo. Diagnosed via `GIT_TERMINAL_PROMPT=0`, which turns the hang into
`fatal: could not read Username for 'https://github.com'`.

**The fix, from Ben's own terminal:**

```bash
cd C:/repos/horrid-wake && git push origin main
```

One prompt, credential caches, and agent-side pushes work again afterwards.

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

| ID | Culture | Calling (path) | HP / AC / Speed |
|---|---|---|---|
| frodo | Hobbit of the Shire | Treasure Hunter (Burglar) | 33 / 15 / 25 |
| sam | Hobbit of the Shire | Warden (Hunter) | 49 / 16 / 25 |
| merry | Hobbit of the Shire | Scholar (Lore) | 33 / 14 / 25 |
| pippin | Hobbit of the Shire | Messenger (Herald) | 33 / 17 / 30 |
| aragorn | Ranger of the North | Captain (Chieftain) | 44 / 16 / 35 |
| boromir | Barding | Captain (Thane) | 44 / 16 / 30 |
| legolas | Elf of Lindon | Champion (Sharp-Shooter) | 44 / 16 / 30 |
| gimli | Dwarf of Durin's Folk | Champion (Slayer) | 59 / 16 / 25 |

All six callings are represented; Captain and Champion are doubled with different paths.

**Ruleset: The Lord of the Rings Roleplaying (Free League, 5e).** Races are *cultures*, classes are *callings*. No Arcana/Religion/History/Survival; History becomes Old Lore, Survival splits into Explore/Hunting/Travel, Riddle is added, Medicine keys off INT. Level cap is 10.

**Build method:** standard array + cultural ability bonuses + the virtue ASIs each calling grants by 5th (two picks for most; Scholar and Treasure Hunter get one). Rewards land at 3rd and 5th, so everyone has exactly two. **Sanity-check these before the table.**

**Boromir is a Barding.** The core book is set in Eriador in TA 2965 and has no Gondor culture. Barding was chosen because the virtue *Stout-Hearted* is itself flavour-quoted about Gondorian lineage joined to Northman spirit.

⚠️ The book's default year is 2965; the Fellowship forms in 3018, when Merry and Pippin aren't born yet. Run it in 3018 and ignore the Tale of Years.

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

1. ~~**Fellowship stat blocks are placeholder**~~ ✅ Done 2026-08-29 — rebuilt against the real ruleset. See "The Party" above. *Old note:* **BLOCKED ON BEN.** The handoff said to rebuild `SHEETS`/`CHARS` from the official LotR 5e sourcebook via Ben's 5e.tools repo. That repo is at `repos/5etools-src` — **but it contains no Middle-earth/LotR content at all.** It's vanilla 5etools; `homebrew/` holds only an `index.json`, and grepping `data/` for Tolkien/Middle-earth/Rings returns nothing but false positives ("Arcadian Springs" etc.). *Question for Ben: which book/ruleset is this actually, and where does its data live?*
2. ~~**No Fellowship portrait art**~~ ✅ Done 2026-08-29 — replaced with gold line-emblems drawn from each character's equipment (see `services/images.js`). Photo portraits were rejected: the cards crop to a ~98px vertical sliver, which destroys faces. *Old note:* **BLOCKED ON BEN.** `imgKey`s `aragorn|legolas|gimli|boromir|merry|pippin|forge` resolve to nothing. This is copyrighted-character art; do NOT AI-generate movie likenesses. Ben must source/commission or supply art. Until then the select screen is 7 blank cards — a visible regression vs. the currently-deployed Always Sunny build.
3. **Sage's Tome integration undecided** — `github.com/kylo-ben/sages-tome` should surface in this app for rules help (half the party is new to D&D, the other half new to the LotR ruleset). Link-out vs. new tab vs. `<iframe>` is undecided, and the repo's deploy status is unknown (its own SESSION_STATE last reported an invalid Groq key + not deployed, but that note is stale).
4. ~~**Sheet level toggle is meaningless**~~ ✅ Done 2026-08-29 — toggle removed, sheets are single-level. *Old note:*  — the sheet still offers LEVEL 1 / LEVEL 5, but every Fellowship `level1` block is a byte-for-byte copy of its `level5` block (level-5 one-shot, no progression). Either write real level-1 blocks or hide the toggle.
5. ~~**Old game infrastructure is dead weight**~~ ✅ Done 2026-08-26 — stripped. See "Removed 2026-08-26" above. Verified in-browser afterward: 13 requests all 200, no 404s, no console errors, select → detail → sheet → level toggle all working.
6. **OneDrive is dehydrating files inside `.git` — REPO HAZARD.** OneDrive.exe was not running on 2026-08-29 and 332 files under `.git` (290 of them objects) are cloud placeholders that return "the cloud file provider exited unexpectedly". This breaks `git add`, `git push`, `repack`, and `fsck` with `mmap failed: Invalid argument`. Workaround used: `git hash-object -w` + `git update-index --cacheinfo` to stage by hash. **Real fix: move this repo off OneDrive.** Commit `f4a3b61` is committed but unpushed; everything after it is uncommitted. Working files are backed up in the session scratchpad.
7. **Design direction changed 2026-08-29.** The app is now reskinned to **HELIX**, the design language of magikdex's Brew flow: cool near-black grounds (`#08090c` / `#12151a` / `#1b2129`), sky-blue accent `#38bdf8`, off-white `#e8eaed` text, HELIX red `#e0555f`, Noto Sans Mono + Zilla Slab type, chunky Win98-style bevels. The old gold/ember Frazetta skin is gone — the "Aesthetic Rules" section further down is **superseded** and kept only for history. Title is IASIP-style: Fira Sans 800 italic, white, no bloom.
8. **The campfire is now blue — open design question.** The ember particles and fire glow were recoloured with everything else. Internally consistent, but a blue fire reads as a portal rather than a hearth. Options: keep as an abstract particle field, delete the fire entirely (recommended — it is a Frazetta idea with no role in a terminal aesthetic), or make the embers the one deliberate warm exception.
9. **IASIP theme assets not yet supplied.** `fonts/iasip.woff2` and `audio/theme.mp3` are wired but absent (3 expected 404s). Note the jingle fires on first tap, not on load — browsers block autoplay with sound. Also: `.s-title h1` used to reference a font named `AVQuest` that was never loaded anywhere; it now uses `var(--display)`.
10. **Two dice modules left dangling, deliberately** — `services/dice.js` (33-line pure roller) is now imported by nothing, and `components/diceRoller.js` is a no-op stub whose comment still claims "dice rolling is handled invisibly by the DM AI." Both were left in place because a dice tray was an old backlog item; delete them if it isn't coming back.
11. **Progression gating / 6th-slot builder / combat system** — all obsolete for the fall one-shot per the scope change. Retained here only in case the summer campaign is revived.

## Aesthetic Rules — SUPERSEDED 2026-08-29 (kept for history; see Known Issues #7)

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


## Shadow: deliberately not modelled (2026-09-04)

The corruption track was built and then removed at Ben's call. It is a
campaign mechanic -- points accrue over many sessions before miserable or
anguished is reached -- and this is one evening with beers. Tracking it by
hand for eight players was overhead nobody was going to pay.

Removed: the pip track and thresholds on the sheet, its tap-to-explain entry,
the CSS, `shadowPath` from all eight builds, and the Hobbit-Sense feature
(advantage on saves vs Shadow), which did nothing once the track was gone.
Sam's Warden feature was renamed Shadow-Lore -> "Favoured Foe: Orcs (+2
damage)" so it does not read as a leftover; it is live and grants real damage.

All recoverable from git history if a campaign ever happens.


## The Loremaster: a rules bot with no backend (2026-09-04) ✅

Wizard icon, bottom-right, on the roster and on every character sheet. Tap it,
ask a rules question in plain English, get an answer with a badge saying where
the answer came from. Hidden while THE MISSION or MY TURN is open, because
those are full-screen and the corner belongs to them.

**Why it is not an LLM.** The ask was "attached to the 5e tools repo". Three
things blocked that, and all three are worth remembering:

1. **The LotR rules text does not exist in 5etools.** TLotRR is there as 438
   index stubs in `search/index-partnered.json` — a name, a page number and a
   category each. No stat blocks, no rules text. It is a lookup table for
   people who already own the book.
2. **Shipping the rules text would be republishing it.** Free League's prose in
   a public repo on a public URL is redistribution, and most of the 5etools
   data has the same problem (non-SRD WotC content). Game *mechanics* are not
   copyrightable; the sentences explaining them are. Every answer in the bot is
   written from scratch for that reason.
3. **There is no backend.** Firebase and Groq went in `cb9b9f1`. An LLM needs a
   Vercel function, an API key, and a per-question cost — and it would fail at
   a venue with bad wifi, which is the one place this thing has to work.

**What it actually is.** `components/loremaster.js` — 34 hand-written entries
covering turn structure, attacking, advantage, death saves, rests, conditions,
opportunity attacks, cover, and the LotR-specific vocabulary (culture, calling,
Fellowship points, Virtues, the renamed skills). A keyword matcher scores the
question against each entry and **refuses to answer below a threshold**. It
runs entirely in the browser: no network call after page load.

Each answer is badged with its source — LotR Roleplaying, 5th Edition, Ben's
call (house rules for this one-shot), or Your sheet. With a character sheet
open it answers from that character's real data: "whats my ac" gets Gimli's 16,
not a definition of AC.

**Verified 2026-09-04:** 36/36 real rules questions answered correctly.
6/6 spoiler-shaped questions ("what monsters are we fighting", "tell me about
the balrog", "who is the boss", "is there a twist", "how many enemies are
there") return **idk man** — the bot has no encounter data and cannot leak the
session.

### Bugs found and fixed during that verification
- "what happens if i hit 0 hp" returned **Hit Points**, not death saves — the
  entry title "Hit points" contains the word *hit*, and the title bonus was
  stacking on top of an exact phrase match. Title weight is now a tie-breaker
  only.
- "how fast am i" returned **Culture, not race** — the phrase "what am i" is
  nothing but stopwords, so it degenerated into matching any question with
  "am" and "i" in it. Phrases with no content word are now skipped.
- "what monsters are we fighting" returned a real answer via "what do i do in a
  fight" → collapsed to the single token *fight*. Short phrases must now match
  in full, and the confidence threshold was raised so the bot fails toward
  "idk man" rather than toward a confident wrong answer.

### Known issues
- **The knowledge base is hand-written and finite.** 34 entries. It covers what
  a new player asks in a fight; it does not cover everything in either book. It
  says "idk man" and points at the DM, which is the correct behaviour but is
  not the same as knowing the rules.
- **The `ACTIONS` combat numbers are still unverified** (~60 derived, not
  transcribed). The verification printable is still outstanding.
- **Dibs is still only Logan/Aragorn.** The roster says "7 still open".

### If an LLM version is ever wanted
It needs: a Vercel serverless function, an API key in project env vars, and a
system prompt carrying the mechanics summaries already written in
`components/loremaster.js` (safe to send — they are original text). Keep the
offline bank as the fallback for when the venue wifi dies.
