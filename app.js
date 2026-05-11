import { initFirebase } from './services/firebase.js';
import './js/dataEngine.js';
import './js/adventureState.js';
import './js/partyState.js';
import { initCampfire } from './components/campfire.js';
import { initDiceRoller } from './components/diceRoller.js';
import { init } from './screens/selectScreen.js';

initFirebase();
initCampfire();
initDiceRoller();
init();
