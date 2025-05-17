// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDkK1GBS165phALuzoi1b249cbAydIAs0",
  authDomain: "cyprusfreeapply-b402c.firebaseapp.com",
  projectId: "cyprusfreeapply-b402c",
  storageBucket: "cyprusfreeapply-b402c.appspot.com",
  messagingSenderId: "388775631856",
  appId: "1:388775631856:web:34cc1e449d668fa1dd9b35",
  measurementId: "G-F4ETP5XZTM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);