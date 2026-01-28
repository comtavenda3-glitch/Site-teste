import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";

// CADASTRAR USUÁRIO
export async function registerUser(name, email, password) {
  try {
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

    console.log("Usuário registrado com sucesso!");
    return user;
  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    throw error;
  }
}

// LOGIN
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("Usuário não encontrado no Firestore");

    return { ...userDoc.data(), uid: user.uid };
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
}
