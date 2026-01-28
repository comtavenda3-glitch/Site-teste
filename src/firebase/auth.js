import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// Cadastro
export async function registerUser(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    balance: 0,
    deposits: [],
    withdrawals: [],
    displayId: Math.floor(1000 + Math.random() * 9000)
  });

  return user;
}

// Login
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const docSnap = await getDoc(doc(db, "users", user.uid));
  if (!docSnap.exists()) throw new Error("Usuário não encontrado");

  return { uid: user.uid, ...docSnap.data() };
}
