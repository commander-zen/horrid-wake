# SESSION_STATE.md — horrid-wake
_Last updated: 2026-10-16 (session 8)_

---

## 🚀 Cold Start Prompt

> Read this file top to bottom before doing anything.
> Current priority: **Ben is re-exporting road-ambience under 95 MB; when it lands, copy it into `C:/repos/horrid-wake/audio/`, point p1 at it with `"stream": true`, and verify it live. Then: Travel music and Fire crackle still have no file, and 8 combat pools are empty. Run the phone checklist (Arm board, a streamed loop, a hit, Cut all) on a real iPhone.**
> As of 2026-10-16 this repo is ONLY the DM soundboard (iasime.vercel.app). The character-select app is preserved at tag `character-select-final` (afaa38a). Everything below "Soundboard" is history from the character-select era.
> Do not suggest architectural changes unless I ask.
> Do not create new files unless I ask — edit existing ones.
> If anything is ambiguous, ask ONE clarifying question, then proceed.

---

## Soundboard (2026-10-16) ✅

- ✅ Tagged the character-select site as `character-select-final` on origin (afaa38a) so it can be restored with `git checkout character-select-final`.
- ✅ `index.html` is now the Old Road Soundboard, adapted from a claude.ai artifact: all `window.claude` cloud sync, the sync chip, "Sync to phone" and Edit mode removed.
- ✅ Pads load from `/sounds.json` (15 pads, 5 scenes). Last good copy is cached in IndexedDB `kv/pads` so the board still opens offline.
- ✅ Audio: `getBuffer` fetches `pad.file`, caches the bytes in IndexedDB `files` keyed by path, then decodes. Arm board pre-downloads everything.
- ✅ `/audio/` exists with only `.gitkeep` — **no real sound files yet**; every pad except Silence/BAM toasts "isn't uploaded yet" until they land.
- ✅ Deleted the character-select code: `app.js`, `components/`, `screens/`, `services/`, `styles/`, `images/*.jpg`.
- Verified at 390px: 15 pads, keys 1–T, no horizontal scroll, every button ≥44px, cached-audio playback, missing-file toast, mixer saved per device.
- ✅ Warg howl pad (p3) renamed "Release the warg", file `/audio/release-the-warg.m4a`.
- ✅ **Combat pools (2026-10-16).** New pad kind `pool` with `folder` + `files` (array of paths). Each tap plays a random file, never the same one twice in a row, layered like a one-shot, with playbackRate 0.94–1.06 and volume within ±10% of `vol`. 11 pools (p16–p26) in scene `combat` live in a strip fixed to the bottom of the screen (4 per row on a phone, collapse toggle, safe-area padding; the page reserves the strip's height so it never covers the last scene). Spells (folders named `spell-*`) are grouped under "Sam's ring". Keys z x c v b n m , . / ; in sounds.json order. Arm board fetches, revalidates (ETag/304) and decodes every pool file and counts them in "N sounds, M updated". Pads use an optional `"short"` label in the strip; the full `label` is the tooltip/aria-label. Folders `/audio/combat/*/` exist with `.gitkeep`; every `files` array is empty for now, so every pool shows as empty.
- Verified at 390px with 3 temporary clips: 24 rapid taps, 0 back-to-back repeats, rates 0.947–1.052, volume 0.906–1.085, overlapping plays, `B` key fires Melee, empty pool toasts, arm counted 3 files and 1 updated after a clip changed, strip 221px expanded / 53px collapsed, footer clears the strip.
- ✅ **First real audio (2026-10-16).** Ben dropped the files into the OneDrive copy; they were copied unchanged into `C:/repos/horrid-wake` (originals left in place). Wired: Release the warg, Orc war chant, Rumble 1 (`rumbe-1-distant.mp3`, typo kept, not renamed), Rumble 2, Wall crash, Balrog roar; warg1–6 → **Warg hit** pool; ouch1–3 → **Hero hit** pool. All 15 decode (1.1–101.8 s) and Arm board reports 15 sounds.
- ✅ **Warg attack pad removed** at Ben's request ("just one warg option"), with its folder. Combat keys shift up by one: Warg hit Z, Orc hit X, Hero hit C, Melee V, Ranged B, Balrog N, Shield M, Healing Word `,`, Thunderwave `.`, Shatter `/`; `;` is unused.
- ✅ **HP tracker (2026-10-16)** at `/tracker` (`tracker.html`, served clean-URL), roster in `/monsters.json` (3 areas, 15 monsters, stats exactly as Ben gave them). One card per monster: name, AC, HP/max, colored bar, amount field + Damage/Heal (Enter = damage), −1/−5/−10. HP clamps 0..max; at 0 the card dims and shows "Down · tap to revive" (→ 1 HP). "Once" checkboxes for Yell of Triumph, Hideous Toughness, Terror of the Deep. Ghashnakh cues show as a sticky banner: "Cue Rumble 1" at ≤60 HP, "Balrog arrives: Rumble 2, Silence, BAM" below 42 HP; each has a Done button and re-arms if he's healed back out of range. Area filter (All / Area 1–3) and per-area Reset with an in-page confirm. State in localStorage: `oldroad_tracker` (hp, used, dismissed cues), `oldroad_view`, `oldroad_monsters` (last good roster, for weak wifi). Same palette and fonts as the soundboard. Both pages have a Soundboard / HP tracker nav above the header.
- Verified: cue thresholds (61 none, 60 Rumble, 42 Rumble only, 41 both), dismiss + re-arm, clamp/down/revive, reload keeps HP/checkbox/cue, reset + cancel, filters; 390px: no horizontal scroll, every control ≥44px (checkbox rows 44px). Bug found and fixed in testing: the reset confirm was visible on load because `.confirm{display:flex}` beat `[hidden]`.

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
10. ~~**Two dice modules left dangling, deliberately**~~ ✅ Gone 2026-10-16 with the rest of the character-select code. *Old note:* — `services/dice.js` (33-line pure roller) is now imported by nothing, and `components/diceRoller.js` is a no-op stub whose comment still claims "dice rolling is handled invisibly by the DM AI." Both were left in place because a dice tray was an old backlog item; delete them if it isn't coming back.
11. **Progression gating / 6th-slot builder / combat system** — all obsolete for the fall one-shot per the scope change. Retained here only in case the summer campaign is revived.
12. **Two local copies of this repo (found 2026-10-16).** `C:/repos/horrid-wake` (canonical, used for the soundboard commit) and `~/OneDrive/Desktop/repos/horrid-wake` (the "scrap" copy — git pull/push/tag worked from it fine this session). Neither had unpushed work; the "Unpushed work" section above is stale — those commits are on origin. Delete the OneDrive copy when convinced.
13. **Left in place, unsure if still needed:** `signal-2026-03-27-092415.jpeg` (tracked, referenced by nothing), `package.json` (name/version only, no build), untracked `images/High_School_Musical.webp` and empty `fonts/`. ~~`vercel.json` cache headers written for the old assets~~ ✅ Fixed 2026-10-16: `/`, `index`, `tracker`, `sounds.json`, `monsters.json` are `no-cache`; `/audio/*` is `public, max-age=3600` (not immutable). The old JS/CSS and year-long immutable image rules are gone. `tracker.html` and `monsters.json` don't exist yet; the rules are ready for them.
14. ~~**Not password-protected yet**~~ ✅ Done 2026-10-16 (code side). `middleware.js` at the repo root (Vercel Routing Middleware, Node runtime, no matcher → every path incl. `/audio/*`, `/sounds.json`, `/tracker.html`, `/monsters.json`) requires HTTP Basic Auth: any username, password from env `SOUNDBOARD_PASSWORD`, compared as SHA-256 digests with `timingSafeEqual`. Wrong/missing → 401 + `WWW-Authenticate: Basic realm="Old Road", charset="UTF-8"`. Env unset → 503, fail closed. Nothing is logged. Continues with `next()` from `@vercel/functions` (pinned 3.9.9); `package.json` gained `"type": "module"` (the docs require it for a framework-less `.js` middleware) and that one dependency. No build script, no lockfile. Tested locally: 503 unset; 401 for none/wrong/prefix/Bearer; pass-through for the right password with any or empty username, and for passwords containing `:`. **The password itself is not in the repo — it lives only in Vercel.**
15. **Stale repo URL:** "What This Project Is" says `github.com/kylo-ben/horrid-wake`; the actual remote is `github.com/commander-zen/horrid-wake`.
16. ~~**Replacing an audio file at the same path won't reach phones that already armed.**~~ ✅ Fixed 2026-10-16. IndexedDB `files` now stores `{blob, etag, lastModified}` per path (older bare-Blob entries still read fine). **Arm board** revalidates every file with `If-None-Match` (or `If-Modified-Since`) and `cache: 'no-cache'`: 304 keeps the copy, 200 with a new ETag replaces the bytes and drops the decoded buffer, and any failure falls back to the cached copy silently. The button then reads "Armed: N sounds, M updated". Tapping a pad without arming still uses the cache first. Live check: Vercel sends a content-hash ETag on `/audio/*` and answers a matching `If-None-Match` with 304 (curl and Chromium fetch). Last-Modified is the deploy time, so it changes every deploy — it's only a fallback. Note: a phone's first arm after this change counts every already-cached file as "updated" once, because the old entries have no ETag.
17. **Pool folders are not scanned.** A static site can't list a directory, so `"folder"` is only a note for where clips go. Each clip must also be added to the pad's `"files"` array or it never plays.
18. **Arm button text wraps the header on a phone.** At 390px, "Armed: N sounds, M updated" is wide enough to push Cut all onto a second row. Still ≥44px and usable, but the header grows ~50px after arming.
19. **The combat strip takes ~221px of a 844px phone screen when expanded** (53px collapsed). Collapse state isn't remembered across reloads.
20. **Correct-password pass-through not yet verified on the live site.** ✅ 2026-10-16: `SOUNDBOARD_PASSWORD` is set in Production; the site went from 503 to 401 with `WWW-Authenticate: Basic realm="Old Road", charset="UTF-8"` and `Cache-Control: no-store` on `/`, `/sounds.json`, `/audio/*`, `/audio/combat/*`, `/tracker`, `/monsters.json` and `/SESSION_STATE.md`, both with no credentials and with a wrong password. `/index.html` and `/tracker.html` return a `cleanUrls` 308 to `/` and `/tracker` before the middleware runs; the redirect carries no content and the target is protected. ✅ 2026-10-17: with the real password, `/`, `/sounds.json`, `/tracker`, `/monsters.json` and `/audio/wall-crash.mp3` all return 200 (see #26). Arm board on the phone is on Ben's checklist.
21. **Every request now runs the middleware** (fluid compute billing), including each audio fetch and Arm-board revalidation. Fine at one-DM scale; worth knowing.
22. **Five full-length tracks can't ship as-is, and Ben wants them untrimmed.** In the OneDrive copy's `audio/`: road-ambience.mp3 824 MB, fight-music.mp3 167 MB, quiet-aftermath.mp3 149 MB, boss-fight-music.mp3 147 MB, balrog-theme.mp3 139 MB. Blockers: (a) GitHub rejects files over 100 MB, so they can't be committed; (b) the board fetches each file whole, saves it in IndexedDB and decodes it into memory, and an hour-long track decodes to gigabytes of PCM, which a phone can't hold. Full-length playback needs a different setup: hosting outside git (e.g. Vercel Blob or similar), plus streaming playback through an `<audio>` element instead of decoding, and probably no offline cache for those tracks. Their pads (p1, p4, p7, p14, p15) still point at placeholder `.m4a` paths.
    **Update 2026-10-17:** Ben re-exported smaller versions into the OneDrive copy: `fight-music(1).mp3` 66.7 MB, `quiet-aftermath(1).mp3` 59.4 MB, `boss-fight-music(1).mp3` 58.6 MB, `balrog-theme(1).mp3` 55.8 MB, `road-ambience(1).mp3` **329.6 MB**. Work stopped per Ben's own rule (stop if any file is over 95 MB). Nothing copied or committed. Also: the requested `"stream": true` flag has **no code behind it** — `index.html` always downloads, caches and decodes whole files — so streaming playback (an `<audio>` element per stream pad, routed through the channel gains, no IndexedDB copy) must be built before these tracks can play on a phone.
    ✅ **Streaming built and 4 of 5 tracks wired (2026-10-17).** Pads with `"stream": true` play through one `<audio>` element each, wired once via `createMediaElementSource` into a gain → channel gain, so faders, fade-ins, channel crossfades, Fade out and Cut all behave like other pads (stop = gain ramp, then `pause()`). Streams are never saved to IndexedDB. Arm board doesn't download them: it sends a HEAD (404 → "Couldn't load") and sets `preload="auto"` to buffer their opening; the "N sounds" count excludes them, and the success toast adds "K long tracks stream and need signal". Pad meta shows "· Stream". Wired, names kept exactly as exported: Fight music → `fight-music(1).mp3` (73 min), Boss fight music → `boss-fight-music(1).mp3` (64 min), Balrog theme → `balrog-theme(1).mp3` (61 min), Quiet aftermath → `quiet-aftermath(1).mp3`. Tested locally: each plays, Fight → Boss crossfade pauses the old one, BAM starts the Balrog theme over Boss music, Cut all pauses everything, Arm leaves stream files out of IndexedDB. **Road ambience (329.6 MB) still waiting on Ben's re-export.** The warg-attack folder stays out, per Ben.
    Caveat: GitHub warns on files over 50 MB (these are 56–67 MB) but accepts them; each push of a new long track adds that much to the repo history.
23. **Travel music and Fire crackle have no file.** Empty pools: Orc hit, Melee, Ranged, Balrog attack, and all four spells.
24. **The real audio now lives in two places**: the OneDrive copy (untracked, where Ben drops files) and `C:/repos` (committed). Future drops should go into `C:/repos/horrid-wake/audio/`.
25. **Tracker state is per browser.** localStorage lives on the laptop that ran the fight; another device starts fresh. Hideous Toughness (Uruk-hai) is a note + checkbox only; the tracker doesn't apply its 1-HP rule automatically.
26. ~~**Live verification (Prompt 7) half done.**~~ ✅ 2026-10-17. No credentials and wrong password → 401 with the Basic challenge. Correct password (one-off curl, not saved anywhere) → 200 on `/`, `/sounds.json`, `/tracker`, `/monsters.json`, `/audio/wall-crash.mp3`. All 22 file paths in `sounds.json` checked: 15 return 200 (6 single files, 6 warg, 3 ouch); the 7 that 404 are exactly the known placeholders (road-ambience, travel-music, fight-music, fire-crackle, boss-fight-music, balrog-theme, quiet-aftermath — all `.m4a`, see #22/#23). Still to do by hand: Ben's phone and laptop checklists.
27. **The site password was pasted into a Claude chat on 2026-10-17** for the curl check. It isn't in the repo, but rotating `SOUNDBOARD_PASSWORD` in Vercel (then redeploying) would keep it out of any transcript.

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
- **Dibs: Logan/Aragorn, Cullen/Sam, Adrian/Legolas, Dan/Gimli, Deen/Merry.** Three still open (2026-09-08).

### If an LLM version is ever wanted
It needs: a Vercel serverless function, an API key in project env vars, and a
system prompt carrying the mechanics summaries already written in
`components/loremaster.js` (safe to send — they are original text). Keep the
offline bank as the fallback for when the venue wifi dies.

## The live URL is https://iasime.vercel.app (2026-09-04)

The Vercel project was renamed and `horrid-wake.vercel.app` now returns
`DEPLOYMENT_NOT_FOUND`. Deploy verification against the old host silently
reported "not deployed" for a change that was in fact live -- 30 polls, all
false negatives, because a 404 body simply does not contain the string being
grepped for.

**Check the status code, not just the content.** And when a deploy looks stuck,
the deployment URL comes from
`gh api repos/commander-zen/horrid-wake/deployments/<id>/statuses`, which
names the environment URL directly, rather than from guessing hostnames.
