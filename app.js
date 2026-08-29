import { initCampfire } from './components/campfire.js';
import { initDiceRoller } from './components/diceRoller.js';
import { init } from './screens/selectScreen.js';

// ── THEME JINGLE ──────────────────────────────────────────────────────
// Autoplay with sound is blocked by every current browser until the user
// interacts with the page, so we can't literally play on load. Instead the
// track is loaded up front and fired by the first pointer/key event, which
// on this screen is the first card tap — effectively immediate.
//
// Drop the audio at audio/theme.mp3. If the file is missing the fetch fails
// silently and the app is unaffected.
function initTheme() {
  const btn = document.getElementById('muteBtn');
  const audio = new Audio('audio/theme.mp3');
  audio.preload = 'auto';
  audio.volume = 0.55;

  let muted = localStorage.getItem('hw-muted') === '1';
  let fired = false;

  const paint = () => {
    btn.textContent = muted ? '♪ OFF' : '♪ ON';
    btn.classList.toggle('muted', muted);
    btn.setAttribute('aria-pressed', String(muted));
  };

  const EVENTS = ['pointerdown', 'keydown', 'touchstart'];
  const fire = () => {
    if (fired) return;
    fired = true;
    EVENTS.forEach(e => window.removeEventListener(e, fire));
    if (!muted) audio.play().catch(() => {});  // still refused: stay quiet
  };
  EVENTS.forEach(e => window.addEventListener(e, fire));

  btn.addEventListener('click', (e) => {
    e.stopPropagation();          // don't let the toggle double as the trigger
    muted = !muted;
    localStorage.setItem('hw-muted', muted ? '1' : '0');
    if (muted) audio.pause();
    else audio.play().catch(() => {});
    paint();
  });

  paint();
}

initCampfire();
initTheme();
initDiceRoller();
init();
