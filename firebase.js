
import { initializeApp } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3t7to8j6fTg_nP2ADMCSbw-_SVAdMH3c",
    authDomain: "lifetracker-51e61.firebaseapp.com",
    projectId: "lifetracker-51e61",
    storageBucket: "lifetracker-51e61.firebasestorage.app",
    messagingSenderId: "487679189255",
    appId: "1:487679189255:web:d60e22e07685f7adf5a5a2",
    measurementId: "G-KE281XBWRV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
