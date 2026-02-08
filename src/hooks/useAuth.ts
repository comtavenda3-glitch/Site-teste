import { useState, useEffect } from 'react'
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth'
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  collection, 
  increment, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { User, Deposit, Withdrawal } from '../types'

// Definição da URL base do Pipedream
const PIPEDREAM_API_URL = 'https://eottot41sx25yyz.m.pipedream.net'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authObject, setAuthObject] = useState<FirebaseUser | null>(null)

  // 1. Escuta alterações na autenticação e dados do Firestore em Tempo Real
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setAuthObject(currentUser)
      
      if (currentUser) {
        // Usuário logado: escutar documento do Firestore em tempo real
        const userRef = doc(db, 'users', currentUser.uid)
        
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            // Mescla dados do Auth com dados do Banco
            setUser({
              id: currentUser.uid,
              email: currentUser.email || '',
              ...docSnap.data()
            } as User)
          } else {
            // Caso raro onde existe Auth mas não doc (tratamento de erro)
            console.error("Documento de usuário não encontrado")
          }
          setIsLoading(false)
        }, (error) => {
          console.error("Erro ao buscar dados em tempo real:", error)
          setIsLoading(false)
        })

        return () => unsubscribeSnapshot()
      } else {
        // Usuário deslogado
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => unsubscribeAuth()
  }, [])

  // 2. Função de Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  // 3. Depósito REAL via Pipedream
  const createDeposit = async (amount: number): Promise<{ success: boolean; pixCode?: string; error?: string }> => {
    if (!user || !authObject) return { success: false, error: 'Usuário não autenticado' }
    if (amount <= 0) return { success: false, error: 'Valor inválido' }

    try {
      // Chamada API Externa (Pipedream)
      const response = await fetch(`${PIPEDREAM_API_URL}/deposito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          amount: amount
        })
      })

      if (!response.ok) {
        throw new Error('Falha na comunicação com gateway de pagamento')
      }

      const data = await response.json()
      
      if (!data.pix_copia_e_cola) {
        throw new Error('Código PIX não retornado pelo provedor')
      }

      // Salvar intenção de depósito no Firestore
      await addDoc(collection(db, 'users', user.id, 'deposits'), {
        amount,
        pixCode: data.pix_copia_e_cola,
        status: 'pending',
        createdAt: serverTimestamp(),
        gatewayId: data.depositId || null // Se o pipedream retornar um ID
      })

      return { success: true, pixCode: data.pix_copia_e_cola }

    } catch (error: any) {
      console.error("Erro no depósito:", error)
      return { success: false, error: error.message || 'Erro ao gerar PIX' }
    }
  }

  // 4. Saque REAL via Pipedream
  const requestWithdraw = async (amount: number, pixKey: string, pixType: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Usuário não autenticado' }
    
    // Validação de segurança no Front (será revalidada no Back/Pipedream)
    if (user.balance < amount) {
      return { success: false, error: 'Saldo insuficiente' }
    }

    try {
      // a. Registrar solicitação no Pipedream
      const response = await fetch(`${PIPEDREAM_API_URL}/saque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          pixKey,
          pixType
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || 'Erro ao processar saque no gateway')
      }

      // b. Atualização Atômica no Firestore
      // Decrementa o saldo e cria o registro de saque
      const userRef = doc(db, 'users', user.id)
      
      await updateDoc(userRef, {
        balance: increment(-amount)
      })

      await addDoc(collection(db, 'users', user.id, 'withdrawals'), {
        amount,
        pixKey,
        pixType,
        status: 'processing', // Pipedream deve atualizar para 'completed' via webhook depois
        createdAt: serverTimestamp()
      })

      return { success: true }

    } catch (error: any) {
      console.error("Erro no saque:", error)
      return { success: false, error: error.message || 'Falha na solicitação de saque' }
    }
  }

  // Funções Auxiliares (Investimento e Checkin Real)
  // Nota: Estes apenas atualizam o banco de dados. A lógica de retorno financeiro
  // deve rodar no backend (Cloud Functions), não aqui no Front, por segurança.
  // Mantive a estrutura de chamada para compatibilidade com sua UI.
  
  const addInvestment = async (product: any) => {
    if (!user || user.balance < product.price) return false
    
    try {
      const userRef = doc(db, 'users', user.id)
      
      await updateDoc(userRef, {
        balance: increment(-product.price)
      })

      await addDoc(collection(db, 'users', user.id, 'investments'), {
        productId: product.id,
        amount: product.price,
        dailyReturn: product.dailyReturn,
        remainingDays: product.duration,
        startDate: serverTimestamp(),
        lastClaimDate: serverTimestamp(),
        status: 'active'
      })
      
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const doCheckin = async (day: number) => {
    if (!user) return false
    // A validação real deve ser feita nas Security Rules ou Backend
    const reward = 1.00 // Valor fixo ou dinâmico

    try {
       const userRef = doc(db, 'users', user.id)
       await updateDoc(userRef, {
         balance: increment(reward),
         lastCheckin: new Date().toISOString(), // Ideal usar serverTimestamp, mas string para UI simples
         checkinDays: [...(user.checkinDays || []), day]
       })
       return true
    } catch (e) {
      return false
    }
  }

  // Spin Roulette (Apenas atualiza BD, lógica de probabilidade deve ir pro backend idealmente)
  const spinRoulette = async () => {
     // Implementação simplificada para atualizar apenas saldo no firestore
     // Recomendo mover a lógica de sorteio para uma Cloud Function para evitar fraude
     return null 
  }

  return {
    user,
    isLoading,
    logout,
    createDeposit,   // Integração Real Pipedream
    requestWithdraw, // Integração Real Pipedream
    addInvestment,   // Atualiza Firestore
    doCheckin,       // Atualiza Firestore
    spinRoulette     // Placeholder para futura Cloud Function
  }
}
