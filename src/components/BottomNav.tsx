import React from 'react'
import { Home, Package, Users, User } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'profile', label: 'Perfil', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-primary-500' : 'text-gray-500'
                }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
