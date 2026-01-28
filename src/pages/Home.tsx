import React, { useState } from 'react'
import { TrendingUp, Users, Wallet } from 'lucide-react'
import { User } from '../types'
import { Roulette } from '../components/Roulette'
import { DailyCheckin } from '../components/DailyCheckin'
import { Toast } from '../components/Toast'

interface HomeProps {
  user: User
  onCheckin: (day: number) => boolean
  onSpinRoulette: () => number | null
}

export function Home({ user, onCheckin, onSpinRoulette }: HomeProps) {
  const [showCheckinToast, setShowCheckinToast] = useState(false)
  const [checkinReward, setCheckinReward] = useState(0)

  const handleCheckin = (day: number) => {
    const rewards = [1, 2, 3, 4, 5, 7, 10]
    const reward = rewards[day - 1] || 0
    const success = onCheckin(day)
    if (success) {
      setCheckinReward(reward)
      setShowCheckinToast(true)
    }
    return success
  }

  return (
    <div className="pb-20 px-4 pt-4">
      <Toast
        message="Parabéns!"
        subMessage={`Você ganhou R$ ${checkinReward.toFixed(2)} no login diário`}
        isVisible={showCheckinToast}
        onClose={() => setShowCheckinToast(false)}
      />

      <div className="flex items-center justify-between mb-6 animate-slide-down">
        <div>
          <p className="text-gray-400 text-sm">Bem-vindo de volta</p>
          <h1 className="text-xl font-bold text-white">{user.name || user.email.split('@')[0]}</h1>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
          <span className="text-xl font-bold text-white">{user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-dark-700/80 backdrop-blur-sm rounded-2xl p-4 border border-dark-600 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-gray-400 text-sm">Ganhos Hoje</span>
          </div>
          <p className="text-2xl font-bold text-primary-500">R$ {user.todayEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-dark-700/80 backdrop-blur-sm rounded-2xl p-4 border border-dark-600 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-gray-400 text-sm">Convidados</span>
          </div>
          <p className="text-2xl font-bold text-primary-500">{user.referrals.length}</p>
        </div>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-primary-500/30 rounded-2xl p-5 mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-primary-500" />
          <span className="text-gray-400 text-sm">Saldo Disponível</span>
        </div>
        <p className="text-3xl font-extrabold text-white">R$ {user.balance.toFixed(2)}</p>
        <div className="mt-3 pt-3 border-t border-dark-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Ganhos</span>
            <span className="text-primary-500 font-semibold">R$ {user.totalEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <DailyCheckin
          checkinDays={user.checkinDays}
          lastCheckin={user.lastCheckin}
          onCheckin={handleCheckin}
        />
      </div>

      <Roulette spins={user.rouletteSpins} onSpin={onSpinRoulette} />
    </div>
  )
}
