import { useState, useEffect } from 'react'
import { User, Deposit, Withdrawal } from '../types'

const STORAGE_KEY = 'monety_state'
const USERS_KEY = 'monety_users'

const generateInviteCode = () => {
  return 'MN' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

const generateId = () => {
  return Math.random().toString(36).substring(2, 15)
}

const generateDisplayId = () => {
  return 'ID' + Math.floor(100000 + Math.random() * 900000).toString()
}

export function useAuth() {
  const [user, setUser] = useState < User | null > (null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const updatedUser = checkPendingReturns(parsed)
        setUser(updatedUser)
        if (updatedUser !== parsed) {
          saveUserToStorage(updatedUser)
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const checkPendingReturns = (userData: User): User => {
    if (!userData.investments || userData.investments.length === 0) return userData

    const now = new Date()
    let totalPending = 0
    let updated = false

    const updatedInvestments = userData.investments.map(inv => {
      if (inv.status !== 'active') return inv

      const lastClaim = new Date(inv.lastClaimDate || inv.startDate)
      const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastClaim >= 24) {
        const daysPassed = Math.floor(hoursSinceLastClaim / 24)
        const claimableDays = Math.min(daysPassed, inv.remainingDays)

        if (claimableDays > 0) {
          const returnAmount = claimableDays * inv.dailyReturn
          totalPending += returnAmount
          updated = true

          const newRemainingDays = inv.remainingDays - claimableDays
          return {
            ...inv,
            remainingDays: newRemainingDays,
            lastClaimDate: now.toISOString(),
            status: newRemainingDays <= 0 ? 'completed' as const : 'active' as const
          }
        }
      }
      return inv
    })

    if (updated) {
      return {
        ...userData,
        balance: userData.balance + totalPending,
        totalEarnings: userData.totalEarnings + totalPending,
        todayEarnings: userData.todayEarnings + totalPending,
        investments: updatedInvestments
      }
    }

    return userData
  }

  const saveUserToStorage = (userData: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const idx = users.findIndex((u: User) => u.id === userData.id)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userData }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const saveUser = (userData: User) => {
    saveUserToStorage(userData)
    setUser(userData)
  }

  const register = (name: string, email: string, password: string, inviteCode?: string): { success: boolean; error?: string } => {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Este e-mail já está cadastrado' }
    }

    let invitedBy: string | null = null
    if (inviteCode) {
      const inviter = users.find(u => u.inviteCode === inviteCode)
      if (inviter) {
        invitedBy = inviter.id
      }
    }

    const newUser: User & { password: string } = {
      id: generateId(),
      displayId: generateDisplayId(),
      name,
      email,
      password,
      balance: 0,
      totalEarnings: 0,
      todayEarnings: 0,
      inviteCode: generateInviteCode(),
      invitedBy,
      referrals: [],
      checkinDays: [],
      lastCheckin: null,
      rouletteSpins: 0,
      investments: [],
      withdrawals: [],
      deposits: [],
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    if (invitedBy) {
      const inviterIdx = users.findIndex(u => u.id === invitedBy)
      if (inviterIdx >= 0) {
        users[inviterIdx].referrals.push({
          id: newUser.id,
          displayId: newUser.displayId,
          name: newUser.name,
          email: newUser.email,
          level: 1,
          earnings: 0,
          hasPurchased: false,
          joinedAt: new Date().toISOString()
        })
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
      }
    }

    return { success: true }
  }

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const foundUser = users.find(u => u.email === email && u.password === password)

    if (!foundUser) {
      return { success: false, error: 'E-mail ou senha incorretos' }
    }

    const { password: _, ...userWithoutPassword } = foundUser
    const checkedUser = checkPendingReturns(userWithoutPassword as User)
    saveUser(checkedUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const addInvestment = (product: { id: number; name: string; price: number; dailyReturn: number; duration: number }) => {
    if (!user || user.balance < product.price) return false

    const now = new Date().toISOString()
    const investment = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      amount: product.price,
      dailyReturn: product.dailyReturn,
      totalDays: product.duration,
      remainingDays: product.duration,
      startDate: now,
      lastClaimDate: now,
      pendingReturn: 0,
      status: 'active' as const
    }

    // Mark user as having purchased for referral system
    const users: (User & { password: string })[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

    // If user was invited, give spin to inviter (level 1 only)
    if (user.invitedBy) {
      const inviterIdx = users.findIndex(u => u.id === user.invitedBy)
      if (inviterIdx >= 0) {
        const inviter = users[inviterIdx]
        const referralIdx = inviter.referrals.findIndex(r => r.id === user.id)
        if (referralIdx >= 0 && !inviter.referrals[referralIdx].hasPurchased) {
          // First purchase - give inviter a spin
          inviter.referrals[referralIdx].hasPurchased = true
          inviter.rouletteSpins += 1
          localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
      }
    }

    const updated = {
      ...user,
      balance: user.balance - product.price,
      investments: [...user.investments, investment]
    }
    saveUser(updated)
    return true
  }

  const doCheckin = (day: number) => {
    if (!user) return false
    const today = new Date().toDateString()
    if (user.lastCheckin === today) return false
    if (user.checkinDays.includes(day)) return false

    const rewards = [1, 2, 3, 4, 5, 7, 10]
    const reward = rewards[day - 1] || 0

    const updated = {
      ...user,
      balance: user.balance + reward,
      todayEarnings: user.todayEarnings + reward,
      totalEarnings: user.totalEarnings + reward,
      checkinDays: [...user.checkinDays, day],
      lastCheckin: today
    }
    saveUser(updated)
    return true
  }

  const spinRoulette = (): number | null => {
    if (!user || user.rouletteSpins <= 0) return null

    // Values: $1, $5, $10, $15, $20, $35, $50, $100
    // $35, $50, $100 = 0% chance
    // $15, $20 = very low chance
    // $1, $5, $10 = higher chance
    const prizes = [1, 5, 10, 15, 20, 35, 50, 100]
    const weights = [35, 30, 20, 10, 5, 0, 0, 0] // $35+ have 0% chance

    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    let prizeIdx = 0

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        prizeIdx = i
        break
      }
    }

    const prize = prizes[prizeIdx]
    const updated = {
      ...user,
      rouletteSpins: user.rouletteSpins - 1,
      balance: user.balance + prize,
      todayEarnings: user.todayEarnings + prize,
      totalEarnings: user.totalEarnings + prize
    }
    saveUser(updated)
    return prize
  }

  const canWithdrawNow = (): { allowed: boolean; message?: string } => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 9 || hour >= 17) {
      return {
        allowed: false,
        message: 'Saques permitidos apenas das 09:00 às 17:00'
      }
    }
    return { allowed: true }
  }

  const requestWithdraw = (amount: number, pixKey: string, pixType?: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'Usuário não encontrado' }

    const withdrawCheck = canWithdrawNow()
    if (!withdrawCheck.allowed) {
      return { success: false, error: withdrawCheck.message }
    }

    if (amount < 35) {
      return { success: false, error: 'Valor mínimo de saque: R$ 35,00' }
    }

    if (user.balance < amount) {
      return { success: false, error: 'Saldo insuficiente' }
    }

    // Fee is deducted from withdrawal amount
    const fee = amount * 0.10
    const netAmount = amount - fee

    const withdrawal: Withdrawal = {
      id: generateId(),
      amount,
      fee,
      netAmount,
      pixKey,
      pixType: pixType || 'cpf',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const updated = {
      ...user,
      balance: user.balance - amount,
      withdrawals: [...user.withdrawals, withdrawal]
    }
    saveUser(updated)
    return { success: true }
  }

  const createDeposit = (amount: number): Deposit | null => {
    if (amount < 30) return null

    const deposit: Deposit = {
      id: generateId(),
      amount,
      status: 'pending',
      pixCode: `00020126580014BR.GOV.BCB.PIX0136${generateId()}520400005303986540${amount.toFixed(2)}5802BR`,
      createdAt: new Date().toISOString()
    }

    if (user) {
      const updated = {
        ...user,
        deposits: [...user.deposits, deposit]
      }
      saveUser(updated)
    }

    return deposit
  }

  const confirmDeposit = (depositId: string) => {
    if (!user) return
    const deposit = user.deposits.find(d => d.id === depositId)
    if (!deposit || deposit.status === 'confirmed') return

    const updated = {
      ...user,
      balance: user.balance + deposit.amount,
      rouletteSpins: user.rouletteSpins + 1,
      deposits: user.deposits.map(d =>
        d.id === depositId ? { ...d, status: 'confirmed' as const } : d
      )
    }
    saveUser(updated)
  }

  return {
    user,
    isLoading,
    register,
    login,
    logout,
    addInvestment,
    doCheckin,
    spinRoulette,
    requestWithdraw,
    canWithdrawNow,
    createDeposit,
    confirmDeposit,
    saveUser
  }
    }
