import { buildCards } from '../components/characterCard.js';
import { initDetailPanel } from '../components/detailPanel.js';
import { initSummerCamp } from './summerCamp.js';

export function init() {
  initSummerCamp();
  initDetailPanel();
  buildCards();
}
