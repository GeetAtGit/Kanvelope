// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions }   from "firebase/functions";  // ← add this

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBG_YFzyY7EcATnyHidCkJWodEaCkqyOYo",
  authDomain: "kanvelope.firebaseapp.com",
  projectId: "kanvelope",
  messagingSenderId: "825686051560",
  appId: "1:825686051560:web:5b4dc2598be68bceeb975d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);  // if you use Analytics


export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);  // ← and this

