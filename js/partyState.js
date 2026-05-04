const PartyState = (() => {

  const PARTY_ID = 'gang';

  async function joinParty(characterId) {
    const presenceRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/characters/${characterId}`);
    await window.firebaseSet(presenceRef, {
      joinedAt: Date.now(),
      status: 'active'
    });
    console.log('[PartyState] Joined party as:', characterId);
  }

  async function pushPlayerMessage(characterId, content) {
    const logRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/conversation`);
    await window.firebasePush(logRef, {
      role: 'user',
      character: characterId,
      content,
      timestamp: Date.now()
    });
  }

  async function pushDMMessage(content) {
    const logRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/conversation`);
    await window.firebasePush(logRef, {
      role: 'assistant',
      content,
      timestamp: Date.now()
    });
  }

  function subscribeToConversation(callback) {
    const logRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/conversation`);
    window.firebaseOnValue(logRef, snapshot => {
      const data = snapshot.val();
      if (!data) return callback([]);
      const messages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });
  }

  function subscribeToPartyMembers(callback) {
    const membersRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/characters`);
    window.firebaseOnValue(membersRef, snapshot => {
      const data = snapshot.val() || {};
      callback(Object.keys(data));
    });
  }

  async function getConversation() {
    const logRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/conversation`);
    const snapshot = await window.firebaseGet(logRef);
    const data = snapshot.val();
    if (!data) return [];
    return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
  }

  async function updateAdventureState(fields) {
    const stateRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/state`);
    await window.firebaseSet(stateRef, { ...fields, updatedAt: Date.now() });
  }

  async function getAdventureState() {
    const stateRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/state`);
    const snapshot = await window.firebaseGet(stateRef);
    return snapshot.val() || { chapterIndex: 1, roomId: null };
  }

  async function setCharacterHp(characterId, hp, maxHp) {
    const hpRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/hp/${characterId}`);
    await window.firebaseSet(hpRef, { hp, maxHp });
  }

  function subscribeToHp(callback) {
    const hpRef = window.firebaseRef(window.firebaseDb, `parties/${PARTY_ID}/hp`);
    window.firebaseOnValue(hpRef, snapshot => {
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
