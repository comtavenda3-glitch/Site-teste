// Funções de autenticação para admin (Firebase v9 modular)

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function loginAdmin(email, password) {
  try {
    // Verificar se é admin
    const adminRef = doc(db, "admins", email);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      return { success: false, error: "Email não autorizado como admin" };
    }

    // Login com Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      success: true,
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
  } catch (error) {
    console.error("Erro de autenticação:", error);
    return { success: false, error: formatFirebaseError(error) };
  }
}

function formatFirebaseError(error) {
  const errorMap = {
    "auth/user-not-found": "Usuário não encontrado",
    "auth/wrong-password": "Senha incorreta",
    "auth/invalid-email": "Email inválido",
    "auth/user-disabled": "Conta desabilitada",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde"
  };

  return errorMap[error.code] || "Erro ao autenticar. Tente novamente";
}

export async function logoutAdmin() {
  await signOut(auth);
  localStorage.removeItem("adminAuth");
  window.location.href = "../admin.html";
}

export function checkAdminAuth() {
  const adminAuth = localStorage.getItem("adminAuth");
  if (!adminAuth) {
    window.location.href = "../admin.html";
    return null;
  }
  return JSON.parse(adminAuth);
}
