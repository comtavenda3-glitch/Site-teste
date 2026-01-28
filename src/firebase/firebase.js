// Firebase v9+ modular
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBo05t4KVpfwF9biqW6DdthsFJAHjrDroE",
  authDomain: "monety-site-2.firebaseapp.com",
  projectId: "monety-site-2",
  storageBucket: "monety-site-2.appspot.com",
  messagingSenderId: "99984573236",
  appId: "1:99984573236:web:3dd0f46f383bf8fd211b61"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Persistência local pro usuário não deslogar ao atualizar
setPersistence(auth, browserLocalPersistence);
