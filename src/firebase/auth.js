// src/firebase/auth.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// Função para registrar usuário
export async function registerUser(name, email, password) {
  try {
    // Cria usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Cria documento no Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      balance: 0,
      deposits: [],
      withdrawals: [],
      displayId: Math.floor(1000 + Math.random() * 9000) // ID aleatório 4 dígitos
    });

    return user;
  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    throw error;
  }
}

// Função para logar usuário
export async function loginUser(email, password) {
  try {
    // Faz login no Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Busca os dados do usuário no Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: user.uid, ...docSnap.data() };
    } else {
      throw new Error("Usuário não encontrado no Firestore");
    }
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
}
