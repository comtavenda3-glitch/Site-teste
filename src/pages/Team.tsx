import React, { useState } from 'react'
import { Users, Copy, CheckCircle, Share2, TrendingUp, Award } from 'lucide-react'
import { User } from '../types'

interface TeamProps {
  user: User
}

export function Team({ user }: TeamProps) {
  const [copied, setCopied] = useState(false)
  const [activeLevel, setActiveLevel] = useState(1)
  const inviteLink = `https://monety.app/reg?code=${user.inviteCode}`

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Monety - Investimentos Inteligentes',
        text: 'Junte-se a mim na Monety e comece a ganhar 20% de retorno diário!',
        url: inviteLink
      })
    } else {
      copyLink()
    }
  }

  const getReferralsByLevel = (level: number) => {
    return user.referrals.filter(r => r.level === level)
  }

  const totalEarnings = user.referrals.reduce((acc, r) => acc + r.earnings, 0)

  return (
    <div className="pb-20 px-4 pt-4">
      <div className="mb-6 animate-slide-down">
        <h1 className="text-2xl font-bold text-white">Minha Equipe</h1>
        <p className="text-gray-400 text-sm">Convide amigos e ganhe comissões</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-gray-400 text-sm">Convidados</span>
          </div>
          <p className="text-2xl font-bold text-white">{user.referrals.length}</p>
        </div>

        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-gray-400 text-sm">Comissões</span>
          </div>
          <p className="text-2xl font-bold text-primary-500">R$ {totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-white">Níveis de Comissão</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-dark-600/50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                <span className="text-primary-500 font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-semibold">Nível 1</p>
                <p className="text-gray-500 text-xs">Convites diretos</p>
              </div>
            </div>
            <span className="text-xl font-bold text-primary-500">20%</span>
          </div>

          <div className="flex items-center justify-between bg-dark-600/50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                <span className="text-gray-400 font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-semibold">Nível 2</p>
                <p className="text-gray-500 text-xs">Convites dos seus convidados</p>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-400">5%</span>
          </div>

          <div className="flex items-center justify-between bg-dark-600/50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600/20 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-semibold">Nível 3</p>
                <p className="text-gray-500 text-xs">Terceiro nível</p>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-500">1%</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 mb-6 animate-fade-in">
        <h3 className="font-bold text-white mb-3">Seu Link de Convite</h3>

        <div className="bg-dark-600/50 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-400 mb-1">Código:</p>
          <p className="text-primary-500 font-bold text-lg">{user.inviteCode}</p>
        </div>

        <div className="bg-dark-600/50 rounded-xl p-3 mb-4">
          <p className="text-sm text-gray-400 mb-1">Link:</p>
          <p className="text-gray-300 text-sm break-all">{inviteLink}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={copyLink}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${copied
                ? 'bg-primary-500 text-white'
                : 'bg-dark-600 text-white hover:bg-dark-500'
              }`}
          >
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>

          <button
            onClick={shareLink}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20"
          >
            <Share2 className="w-5 h-5" />
            Compartilhar
          </button>
        </div>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 animate-fade-in">
        <h3 className="font-bold text-white mb-4">Meus Convidados</h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`py-3 rounded-xl font-semibold text-sm transition-all ${activeLevel === level
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-dark-600/50 text-gray-400 hover:bg-dark-500'
                }`}
            >
              Nível {level}
              <span className="ml-1 text-xs opacity-70">
                ({getReferralsByLevel(level).length})
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-hidden">
          <div
            className="transition-all duration-300 ease-out"
            key={activeLevel}
          >
            {getReferralsByLevel(activeLevel).length === 0 ? (
              <div className="text-center py-8 animate-fade-in">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nenhum convidado no nível {activeLevel}</p>
                {activeLevel === 1 && (
                  <p className="text-gray-500 text-sm">Compartilhe seu link e comece a ganhar!</p>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getReferralsByLevel(activeLevel).map((referral, index) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between bg-dark-600/50 rounded-xl p-3 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-bold text-sm">
                          {referral.name ? referral.name[0].toUpperCase() : referral.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{referral.name || referral.email}</p>
                        <p className="text-gray-500 text-xs">{referral.displayId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-500 font-bold text-sm">+R$ {referral.earnings.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(referral.joinedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
