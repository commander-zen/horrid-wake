export function initFirebase() {
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_API_KEY_HERE",
    databaseURL: "YOUR_API_KEY_HERE",
    projectId: "YOUR_API_KEY_HERE",
    storageBucket: "YOUR_API_KEY_HERE",
    messagingSenderId: "YOUR_API_KEY_HERE",
    appId: "YOUR_API_KEY_HERE"
  };

  try {
    const _app = firebase.initializeApp(firebaseConfig);
    const _db = firebase.database();

    window.firebaseDb = _db;
    window.firebaseRef = (db, path) => db.ref(path);
    window.firebasePush = (ref) => ref.push.bind(ref);
    window.firebaseOnValue = (ref, cb) => ref.on('value', cb);
    window.firebaseSet = (ref, val) => ref.set(val);
    window.firebaseGet = (ref) => ref.once('value');

    console.log('[Firebase] Initialized via compat SDK');
  } catch (e) {
    console.warn('[Firebase] Initialization failed — running without Firebase.', e.message);
    window.firebaseDb = null;
    window.firebaseRef = null;
    window.firebasePush = null;
    window.firebaseOnValue = null;
    window.firebaseSet = null;
    window.firebaseGet = null;
  }
}
