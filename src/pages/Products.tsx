import React, { useState } from 'react'
import { TrendingUp, Clock, CheckCircle, AlertCircle, History, X, Timer, Pickaxe, Gem, Crown, Sparkles, Zap, Star, Award } from 'lucide-react'
import { User, Product } from '../types'
import { Toast } from '../components/Toast'

interface ProductsProps {
  user: User
  onInvest: (product: Product) => boolean
}

const products: Product[] = [
  { id: 1, name: 'Minerador Bronze', price: 30, dailyReturn: 6, duration: 60, icon: 'pickaxe', tier: 'bronze' },
  { id: 2, name: 'Minerador Prata', price: 50, dailyReturn: 10, duration: 60, icon: 'pickaxe', tier: 'silver' },
  { id: 3, name: 'Minerador Ouro', price: 100, dailyReturn: 20, duration: 60, icon: 'gem', tier: 'gold' },
  { id: 4, name: 'Minerador Platina', price: 250, dailyReturn: 50, duration: 60, icon: 'sparkles', tier: 'platinum' },
  { id: 5, name: 'Minerador Diamante', price: 500, dailyReturn: 100, duration: 60, icon: 'gem', tier: 'diamond' },
  { id: 6, name: 'Minerador Esmeralda', price: 1000, dailyReturn: 200, duration: 60, icon: 'star', tier: 'emerald' },
  { id: 7, name: 'Minerador Elite', price: 2500, dailyReturn: 500, duration: 60, icon: 'crown', tier: 'elite' },
]

const tierColors: Record<string, { bg: string; border: string; icon: string }> = {
  bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700/30', icon: 'text-amber-500' },
  silver: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: 'text-gray-400' },
  gold: { bg: 'bg-yellow-600/20', border: 'border-yellow-600/30', icon: 'text-yellow-500' },
  platinum: { bg: 'bg-cyan-600/20', border: 'border-cyan-600/30', icon: 'text-cyan-400' },
  diamond: { bg: 'bg-blue-600/20', border: 'border-blue-600/30', icon: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-600/20', border: 'border-emerald-600/30', icon: 'text-emerald-400' },
  elite: { bg: 'bg-primary-600/20', border: 'border-primary-600/30', icon: 'text-primary-400' },
}

const getIcon = (iconName: string, className: string) => {
  const icons: Record<string, React.ReactNode> = {
    pickaxe: <Pickaxe className={className} />,
    gem: <Gem className={className} />,
    crown: <Crown className={className} />,
    sparkles: <Sparkles className={className} />,
    zap: <Zap className={className} />,
    star: <Star className={className} />,
    award: <Award className={className} />,
  }
  return icons[iconName] || <Pickaxe className={className} />
}

function getRemainingDays(startDate: string, totalDays: number): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, totalDays - diffDays)
}

export function Products({ user, onInvest }: ProductsProps) {
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [purchasedProduct, setPurchasedProduct] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const handleInvest = (product: Product) => {
    if (user.balance < product.price) {
      setShowErrorToast(true)
      return
    }

    const success = onInvest(product)
    if (success) {
      setPurchasedProduct(product.name)
      setShowSuccessToast(true)
    }
  }

  const activeInvestments = user.investments.filter(i => i.status === 'active')

  return (
    <div className="pb-20 px-4 pt-4">
      <Toast
        message="Compra realizada!"
        subMessage={`Você adquiriu o ${purchasedProduct} com sucesso`}
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      <Toast
        message="Saldo insuficiente"
        subMessage="Faça um depósito para continuar"
        isVisible={showErrorToast}
        onClose={() => setShowErrorToast(false)}
      />

      <div className="flex items-center justify-between mb-4 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-gray-400 text-sm">Invista e receba 20% de retorno diário</p>
        </div>
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 bg-dark-700/80 backdrop-blur-sm border border-dark-600 px-4 py-2 rounded-xl hover:bg-dark-600 transition-all"
        >
          <History className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-white">Histórico</span>
        </button>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-primary-500/20 rounded-xl p-3 mb-6 flex items-center gap-3 animate-fade-in">
        <TrendingUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          Todos os mineradores rendem <span className="text-primary-500 font-bold">20% ao dia</span> sobre o valor investido
        </p>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-6 flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-gray-400 text-sm">Seu saldo</p>
          <p className="text-xl font-bold text-white">R$ {user.balance.toFixed(2)}</p>
        </div>
        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary-500" />
        </div>
      </div>

      <div className="space-y-3">
        {products.map((product, index) => {
          const colors = tierColors[product.tier]
          return (
            <div
              key={product.id}
              className={`${colors.bg} border ${colors.border} rounded-xl overflow-hidden animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      {getIcon(product.icon, `w-5 h-5 ${colors.icon}`)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{product.name}</h3>
                      <p className="text-primary-500 font-bold">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-primary-500" />
                      <span className="text-gray-500 text-xs">Diário</span>
                    </div>
                    <p className="text-sm font-bold text-primary-500">R$ {product.dailyReturn.toFixed(2)}</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500 text-xs">Duração</span>
                    </div>
                    <p className="text-sm font-bold text-white">{product.duration} dias</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-primary-500" />
                      <span className="text-gray-500 text-xs">ROI</span>
                    </div>
                    <p className="text-sm font-bold text-primary-500">
                      {((product.dailyReturn * product.duration / product.price) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-lg p-2 mb-3 text-center">
                  <span className="text-gray-500 text-xs">Retorno total em {product.duration} dias</span>
                  <p className="text-lg font-bold text-primary-500">
                    R$ {(product.dailyReturn * product.duration).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleInvest(product)}
                  disabled={user.balance < product.price}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${user.balance >= product.price
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/20'
                      : 'bg-dark-600 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {user.balance >= product.price ? 'COMPRAR AGORA' : 'SALDO INSUFICIENTE'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="bg-dark-800 w-full max-w-lg rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Histórico de Compras</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center hover:bg-dark-600 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {activeInvestments.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum investimento ativo</p>
                <p className="text-gray-500 text-sm">Compre um produto para começar a ganhar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeInvestments.map((inv) => {
                  const remainingDays = getRemainingDays(inv.startDate, inv.totalDays)
                  return (
                    <div key={inv.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{inv.productName}</h3>
                        <span className="text-primary-500 font-bold">R$ {inv.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Timer className="w-4 h-4" />
                          <span>Tempo restante</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary-500/20 px-3 py-1 rounded-full">
                            <span className="text-primary-500 font-bold text-sm">{remainingDays} dias</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 bg-dark-600 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-400 h-full transition-all"
                          style={{ width: `${((inv.totalDays - remainingDays) / inv.totalDays) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Rendimento diário: <span className="text-primary-500">+R$ {inv.dailyReturn.toFixed(2)}</span>
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
