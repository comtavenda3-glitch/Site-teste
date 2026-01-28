// Arquivo principal do admin - funções auxiliares

// Função para formatar moeda
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Função para formatar data
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('pt-BR');
}

// Função para gerar ID único
function generateId() {
  return 'ADM_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Verificar autenticação ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  const adminAuth = localStorage.getItem('adminAuth');
  if (adminAuth) {
    const { email } = JSON.parse(adminAuth);
    const adminEmailElement = document.getElementById('adminEmail');
    if (adminEmailElement) {
      adminEmailElement.textContent = email;
    }
  }
});
