const PartyState = (() => {

  const PARTY_ID = 'gang';

  function noDb(fn) {
    console.warn(`[PartyState] Firebase not configured — ${fn}() skipped.`);
  }

  async function joinParty(characterId) {
    if (!window.firebaseDb) { noDb('joinParty'); return; }
    const presenceRef = window.firebaseDb.ref(`parties/${PARTY_ID}/characters/${characterId}`);
    await presenceRef.set({ joinedAt: Date.now(), status: 'active' });
    console.log('[PartyState] Joined party as:', characterId);
  }

  async function pushPlayerMessage(characterId, content) {
    if (!window.firebaseDb) { noDb('pushPlayerMessage'); return; }
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    await logRef.push({ role: 'user', character: characterId, content, timestamp: Date.now() });
  }

  async function pushDMMessage(content) {
    if (!window.firebaseDb) { noDb('pushDMMessage'); return; }
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    await logRef.push({ role: 'assistant', content, timestamp: Date.now() });
  }

  function subscribeToConversation(callback) {
    if (!window.firebaseDb) { noDb('subscribeToConversation'); callback([]); return; }
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    logRef.on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return callback([]);
      const messages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });
  }

  function subscribeToPartyMembers(callback) {
    if (!window.firebaseDb) { noDb('subscribeToPartyMembers'); callback([]); return; }
    const membersRef = window.firebaseDb.ref(`parties/${PARTY_ID}/characters`);
    membersRef.on('value', snapshot => {
      const data = snapshot.val() || {};
      callback(Object.keys(data));
    });
  }

  async function getConversation() {
    if (!window.firebaseDb) { noDb('getConversation'); return []; }
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    const snapshot = await logRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
  }

  async function updateAdventureState(fields) {
    if (!window.firebaseDb) { noDb('updateAdventureState'); return; }
    const stateRef = window.firebaseDb.ref(`parties/${PARTY_ID}/state`);
    await stateRef.set({ ...fields, updatedAt: Date.now() });
  }

  async function getAdventureState() {
    if (!window.firebaseDb) { noDb('getAdventureState'); return { chapterIndex: 1, roomId: null }; }
    const stateRef = window.firebaseDb.ref(`parties/${PARTY_ID}/state`);
    const snapshot = await stateRef.once('value');
    return snapshot.val() || { chapterIndex: 1, roomId: null };
  }

  async function setCharacterHp(characterId, hp, maxHp) {
    if (!window.firebaseDb) { noDb('setCharacterHp'); return; }
    const hpRef = window.firebaseDb.ref(`parties/${PARTY_ID}/hp/${characterId}`);
    await hpRef.set({ hp, maxHp });
  }

  function subscribeToHp(callback) {
    if (!window.firebaseDb) { noDb('subscribeToHp'); callback({}); return; }
    const hpRef = window.firebaseDb.ref(`parties/${PARTY_ID}/hp`);
    hpRef.on('value', snapshot => {
      callback(snapshot.val() || {});
    });
  }

  return {
    joinParty,
    pushPlayerMessage,
    pushDMMessage,
    subscribeToConversation,
    subscribeToPartyMembers,
    getConversation,
    updateAdventureState,
    getAdventureState,
    setCharacterHp,
    subscribeToHp
  };

})();
