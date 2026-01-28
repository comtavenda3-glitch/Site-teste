export interface User {
  id: string
  displayId: string
  name: string
  email: string
  balance: number
  totalEarnings: number
  todayEarnings: number
  inviteCode: string
  invitedBy: string | null
  referrals: Referral[]
  checkinDays: number[]
  lastCheckin: string | null
  rouletteSpins: number
  investments: Investment[]
  withdrawals: Withdrawal[]
  deposits: Deposit[]
  createdAt: string
}

export interface Referral {
  id: string
  displayId: string
  name: string
  email: string
  level: number
  earnings: number
  hasPurchased: boolean
  joinedAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  dailyReturn: number
  duration: number
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'emerald' | 'elite'
}

export interface Investment {
  id: string
  productId: number
  productName: string
  amount: number
  dailyReturn: number
  totalDays: number
  remainingDays: number
  startDate: string
  lastClaimDate: string
  pendingReturn: number
  status: 'active' | 'completed'
}

export interface Withdrawal {
  id: string
  amount: number
  fee: number
  netAmount: number
  pixKey: string
  pixType?: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  createdAt: string
}

export interface Deposit {
  id: string
  amount: number
  status: 'pending' | 'confirmed'
  pixCode: string
  createdAt: string
}
