import React from 'react'
import { Calendar, Check, Gift } from 'lucide-react'

interface DailyCheckinProps {
  checkinDays: number[]
  lastCheckin: string | null
  onCheckin: (day: number) => boolean
}

export function DailyCheckin({ checkinDays, lastCheckin, onCheckin }: DailyCheckinProps) {
  const today = new Date().toDateString()
  const canCheckin = lastCheckin !== today
  const currentDay = checkinDays.length + 1
  const rewards = [1, 2, 3, 4, 5, 7, 10]

  const handleCheckin = () => {
    if (canCheckin && currentDay <= 7) {
      onCheckin(currentDay)
    }
  }

  return (
    <div className="bg-dark-700 border border-dark-600 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary-500" />
        <h3 className="font-bold text-lg text-white">Login Diário</h3>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const isCompleted = checkinDays.includes(day)
          const isCurrent = day === currentDay && canCheckin
          const reward = rewards[day - 1]

          return (
            <div
              key={day}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isCompleted
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : isCurrent
                    ? 'bg-primary-500/10 border border-primary-500 animate-pulse'
                    : 'bg-dark-600 border border-dark-500'
                }`}
            >
              <span className="text-xs text-gray-400 mb-1">Dia {day}</span>
              {isCompleted ? (
                <Check className="w-5 h-5 text-primary-500" />
              ) : (
                <Gift className={`w-5 h-5 ${isCurrent ? 'text-primary-500' : 'text-gray-500'}`} />
              )}
              <span className={`text-xs font-bold mt-1 ${isCompleted || isCurrent ? 'text-primary-400' : 'text-gray-500'}`}>
                R${reward}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleCheckin}
        disabled={!canCheckin || currentDay > 7}
        className={`w-full py-3 rounded-xl font-bold transition-all ${canCheckin && currentDay <= 7
            ? 'bg-primary-500 text-white hover:bg-primary-600'
            : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
      >
        {currentDay > 7 ? 'Ciclo Completo!' : canCheckin ? `Resgatar R$ ${rewards[currentDay - 1] || 0}` : 'Já fez check-in hoje'}
      </button>
    </div>
  )
}
