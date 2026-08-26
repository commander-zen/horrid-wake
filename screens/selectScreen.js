import { buildCards } from '../components/characterCard.js';
import { initDetailPanel } from '../components/detailPanel.js';
import { initCharacterSheet } from '../components/characterSheet.js';

export function init() {
  initCharacterSheet();
  initDetailPanel();
  buildCards();
}
