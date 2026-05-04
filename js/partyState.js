const PartyState = (() => {

  const PARTY_ID = 'gang';

  async function joinParty(characterId) {
    const presenceRef = window.firebaseDb.ref(`parties/${PARTY_ID}/characters/${characterId}`);
    await presenceRef.set({ joinedAt: Date.now(), status: 'active' });
    console.log('[PartyState] Joined party as:', characterId);
  }

  async function pushPlayerMessage(characterId, content) {
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    await logRef.push({ role: 'user', character: characterId, content, timestamp: Date.now() });
  }

  async function pushDMMessage(content) {
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    await logRef.push({ role: 'assistant', content, timestamp: Date.now() });
  }

  function subscribeToConversation(callback) {
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    logRef.on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return callback([]);
      const messages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });
  }

  function subscribeToPartyMembers(callback) {
    const membersRef = window.firebaseDb.ref(`parties/${PARTY_ID}/characters`);
    membersRef.on('value', snapshot => {
      const data = snapshot.val() || {};
      callback(Object.keys(data));
    });
  }

  async function getConversation() {
    const logRef = window.firebaseDb.ref(`parties/${PARTY_ID}/conversation`);
    const snapshot = await logRef.once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
  }

  async function updateAdventureState(fields) {
    const stateRef = window.firebaseDb.ref(`parties/${PARTY_ID}/state`);
    await stateRef.set({ ...fields, updatedAt: Date.now() });
  }

  async function getAdventureState() {
    const stateRef = window.firebaseDb.ref(`parties/${PARTY_ID}/state`);
    const snapshot = await stateRef.once('value');
    return snapshot.val() || { chapterIndex: 1, roomId: null };
  }

  async function setCharacterHp(characterId, hp, maxHp) {
    const hpRef = window.firebaseDb.ref(`parties/${PARTY_ID}/hp/${characterId}`);
    await hpRef.set({ hp, maxHp });
  }

  function subscribeToHp(callback) {
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
