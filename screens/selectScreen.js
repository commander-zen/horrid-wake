import { buildCards } from '../components/characterCard.js';
import { initCharacterSheet } from '../components/characterSheet.js';
import { initCombat } from './combat.js';

// The pre-game briefing. Player-facing only: what Rowan tells you on the road
// and nothing past it.
function initMission() {
  const view = document.getElementById('missionView');
  document.getElementById('missionOpen')
    .addEventListener('click', () => view.classList.add('open'));
  document.getElementById('missionClose')
    .addEventListener('click', () => view.classList.remove('open'));
}

export function init() {
  initMission();
  initCharacterSheet();
  initCombat();
  buildCards();
}
