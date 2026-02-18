 // src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAEuH1f1TentKFspIiQuRY-3eHo_YyeKVo",
  authDomain: "intrest-calculator-986ec.firebaseapp.com",
  projectId: "intrest-calculator-986ec",
  storageBucket: "intrest-calculator-986ec.firebasestorage.app",
  messagingSenderId: "981487424100",
  appId: "1:981487424100:web:88d0f8dadefc1577b90571",
  measurementId: "G-HLB95QEVHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider };
