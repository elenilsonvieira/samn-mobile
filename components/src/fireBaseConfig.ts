import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBae0LBVtF2uKVrxBR6Y5-O3ryek9QeWvk",
  authDomain: "agenda-monitoria.firebaseapp.com",
  projectId: "agenda-monitoria",
  storageBucket: "agenda-monitoria.firebasestorage.app",
  messagingSenderId: "807033164096",
  appId: "1:807033164096:web:b677a6a9ebc64dc29e2aa5"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const nowTs = () => serverTimestamp();