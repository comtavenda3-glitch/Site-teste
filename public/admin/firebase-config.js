// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configura o Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBo05t4KVpfwF9biqW6DdthsFJAHjrDroE",
  authDomain: "monety-site-2.firebaseapp.com",
  projectId: "monety-site-2",
  storageBucket: "monety-site-2.firebasestorage.app",
  messagingSenderId: "99984573236",
  appId: "1:99984573236:web:3dd0f46f383bf8fd211b61"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Persistência local pro login ficar salvo
setPersistence(auth, browserLocalPersistence);

// =================== FUNÇÕES ===================

// Criar usuário
export async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Salvar dados extras no Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name || "",
      email: email,
      balance: 0,
      deposits: [],
      withdrawals: [],
      displayId: Math.floor(Math.random() * 9000 + 1000) // exemplo de displayId
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Logar usuário
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Pegar dados extras do Firestore
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      return { success: true, user: docSnap.data() };
    } else {
      return { success: false, error: "Usuário não encontrado no Firestore" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
