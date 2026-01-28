// Funções de autenticação para admin

async function loginAdmin(email, password) {
  try {
    // Verificar se é admin
    const adminDoc = await db.collection('admins').doc(email).get();

    if (!adminDoc.exists) {
      return { success: false, error: 'Email não autorizado como admin' };
    }

    // Fazer login com Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(email, password);

    return {
      success: true,
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return { success: false, error: formatFirebaseError(error) };
  }
}

function formatFirebaseError(error) {
  const errorMap = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Conta desabilitada',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
  };

  return errorMap[error.code] || 'Erro ao autenticar. Tente novamente';
}

function logoutAdmin() {
  auth.signOut();
  localStorage.removeItem('adminAuth');
  window.location.href = '../admin.html';
}

function checkAdminAuth() {
  const adminAuth = localStorage.getItem('adminAuth');
  if (!adminAuth) {
    window.location.href = '../admin.html';
    return null;
  }
  return JSON.parse(adminAuth);
}
