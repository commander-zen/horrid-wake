import { buildCards } from '../components/characterCard.js';
import { initDetailPanel } from '../components/detailPanel.js';
import { initCharacterSheet } from '../components/characterSheet.js';
import { initCombat } from './combat.js';

export function init() {
  initCharacterSheet();
  initCombat();
  initDetailPanel();
  buildCards();
}
