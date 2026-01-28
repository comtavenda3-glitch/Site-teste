import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { BottomNav } from './components/BottomNav'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Team } from './pages/Team'
import { Profile } from './pages/Profile'

type AuthScreen = 'login' | 'register'

function App() {
  const { user, isLoading, register, login, logout, addInvestment, doCheckin, spinRoulette, requestWithdraw, createDeposit, confirmDeposit } = useAuth()
  const [authScreen, setAuthScreen] = useState < AuthScreen > ('login')
  const [activeTab, setActiveTab] = useState('home')
  const [inviteCodeFromUrl, setInviteCodeFromUrl] = useState('')

  // Check for invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      setInviteCodeFromUrl(code)
      setAuthScreen('register')
    }
  }, [])

  // Ensure home tab is active after login
  useEffect(() => {
    if (user && activeTab === '') {
      setActiveTab('home')
    }
  }, [user, activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (authScreen === 'login') {
      return <Login onLogin={login} onGoToRegister={() => setAuthScreen('register')} />
    }
    return (
      <Register
        onRegister={register}
        onGoToLogin={() => setAuthScreen('login')}
        initialInviteCode={inviteCodeFromUrl}
      />
    )
  }

  const handleInvest = (product: { id: number; name: string; price: number; dailyReturn: number; duration: number }) => {
    return addInvestment(product)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-lg mx-auto">
        {activeTab === 'home' && (
          <Home user={user} onCheckin={doCheckin} onSpinRoulette={spinRoulette} />
        )}
        {activeTab === 'products' && (
          <Products user={user} onInvest={handleInvest} />
        )}
        {activeTab === 'team' && <Team user={user} />}
        {activeTab === 'profile' && (
          <Profile
            user={user}
            onLogout={logout}
            onDeposit={createDeposit}
            onConfirmDeposit={confirmDeposit}
            onWithdraw={requestWithdraw}
          />
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
