const AdventureState = (() => {

  const VERSION = 1;

  // Returns the localStorage key for a given character
  function stateKey(characterId) {
    return `horrid-wake:adventure:${characterId}`;
  }

  // Default state for a new adventure
  function defaultState(characterId) {
    return {
      version: VERSION,
      characterId,
      level: 1,
      hp: null,          // set from SHEETS data on first load
      maxHp: null,
      chapterIndex: 1,   // Start at chapter 1: Goblin Arrows
      roomId: null,      // null = not yet in a specific room
      visitedRooms: [],  // array of room names already seen
      inventory: [],     // items picked up
      gold: 0,
      conditions: [],    // e.g. "poisoned", "unconscious"
      conversationHistory: [], // AI message history [{role, content}]
      startedAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  // Load state for a character — returns null if none exists or version mismatch
  function load(characterId) {
    try {
      const raw = localStorage.getItem(stateKey(characterId));
      if (!raw) return null;
      const state = JSON.parse(raw);
      if (state.version !== VERSION) return null; // wipe stale state
      return state;
    } catch (e) {
      console.warn('[AdventureState] Load failed:', e);
      return null;
    }
  }

  // Save state for a character
  function save(state) {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(stateKey(state.characterId), JSON.stringify(state));
    } catch (e) {
      console.warn('[AdventureState] Save failed:', e);
    }
  }

  // Start a fresh adventure for a character
  // Pass in the character's level 1 sheet data to set HP
  function startNew(characterId, sheet) {
    const state = defaultState(characterId);
    state.hp = sheet.hp;
    state.maxHp = sheet.hp;
    save(state);
    console.log('[AdventureState] New adventure started for:', characterId);
    return state;
  }

  // Check if a character has an existing adventure in progress
  function hasProgress(characterId) {
    return localStorage.getItem(stateKey(characterId)) !== null;
  }

  // Update specific fields and save
  function update(state, fields) {
    Object.assign(state, fields);
    save(state);
    return state;
  }

  // Add a message to conversation history and save
  function addMessage(state, role, content) {
    state.conversationHistory.push({ role, content });
    // Keep history to last 40 messages to avoid token bloat
    if (state.conversationHistory.length > 40) {
      state.conversationHistory = state.conversationHistory.slice(-40);
    }
    save(state);
    return state;
  }

  // Mark a room as visited
  function visitRoom(state, roomName) {
    if (!state.visitedRooms.includes(roomName)) {
      state.visitedRooms.push(roomName);
      save(state);
    }
    return state;
  }

  // Add item to inventory
  function addItem(state, item) {
    state.inventory.push(item);
    save(state);
    return state;
  }

  // Add gold
  function addGold(state, amount) {
    state.gold += amount;
    save(state);
    return state;
  }

  // Update HP (clamp to 0-maxHp)
  function setHp(state, newHp) {
    state.hp = Math.max(0, Math.min(newHp, state.maxHp));
    save(state);
    return state;
  }

  // Level up — increment level, update hp from new sheet
  function levelUp(state, newLevel, newSheet) {
    state.level = newLevel;
    state.maxHp = newSheet.hp;
    state.hp = newSheet.hp; // full heal on level up
    save(state);
    console.log('[AdventureState] Leveled up to:', newLevel);
    return state;
  }

  // Wipe adventure progress for a character
  function reset(characterId) {
    localStorage.removeItem(stateKey(characterId));
    console.log('[AdventureState] Progress reset for:', characterId);
  }

  return {
    load,
    save,
    startNew,
    hasProgress,
    update,
    addMessage,
    visitRoom,
    addItem,
    addGold,
    setHp,
    levelUp,
    reset
  };

})();
