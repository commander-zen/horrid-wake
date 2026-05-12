export function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAQ82FwdF4IbD6jIAKN5frnUacI3PTc2Ow",
    authDomain: "horrid-wake.firebaseapp.com",
    databaseURL: "https://horrid-wake-default-rtdb.firebaseio.com",
    projectId: "horrid-wake",
    storageBucket: "horrid-wake.firebasestorage.app",
    messagingSenderId: "683459567",
    appId: "1:683459567:web:a5840999d85ad4aac0ec1a"
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
