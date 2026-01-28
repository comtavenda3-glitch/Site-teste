import React, { useState } from 'react'
import { Wallet, ArrowUpCircle, ArrowDownCircle, History, LogOut, Copy, CheckCircle, AlertCircle, Mail, Phone, CreditCard, User, Hash, Clock, MessageCircle } from 'lucide-react'
import { User as UserType, Deposit, Withdrawal } from '../types'

interface ProfileProps {
  user: UserType
  onLogout: () => void
  onDeposit: (amount: number) => Deposit | null
  onConfirmDeposit: (id: string) => void
  onWithdraw: (amount: number, pixKey: string, pixType: string) => { success: boolean; error?: string }
}

export function Profile({ user, onLogout, onDeposit, onConfirmDeposit, onWithdraw }: ProfileProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'deposit' | 'withdraw' | 'deposits-history' | 'withdrawals-history'>('main')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [pixType, setPixType] = useState('cpf')
  const [currentDeposit, setCurrentDeposit] = useState<Deposit | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState('')
  const [copied, setCopied] = useState(false)

  const canWithdrawNow = (): { allowed: boolean; message?: string } => {
    const now = new Date()
    const hour = now.getHours()
    if (hour < 9 || hour >= 17) {
      return { allowed: false, message: 'Saques permitidos apenas das 09:00 às 17:00' }
    }
    return { allowed: true }
  }

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount < 30) {
      setShowError('Valor mínimo de depósito: R$ 30,00')
      setTimeout(() => setShowError(''), 3000)
      return
    }

    const deposit = onDeposit(amount)
    if (deposit) {
      setCurrentDeposit(deposit)
    }
  }

  const handleConfirmDeposit = () => {
    if (currentDeposit) {
      onConfirmDeposit(currentDeposit.id)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setCurrentDeposit(null)
        setDepositAmount('')
        setActiveSection('main')
      }, 2000)
    }
  }

  const handleWithdraw = () => {
    const withdrawCheck = canWithdrawNow()
    if (!withdrawCheck.allowed) {
      setShowError(withdrawCheck.message || 'Saque não permitido no momento')
      setTimeout(() => setShowError(''), 3000)
      return
    }

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < 35) {
      setShowError('Valor mínimo de saque: R$ 35,00')
      setTimeout(() => setShowError(''), 3000)
      return
    }

    if (amount > user.balance) {
      setShowError(`Saldo insuficiente. Seu saldo: R$ ${user.balance.toFixed(2)}`)
      setTimeout(() => setShowError(''), 3000)
      return
    }

    if (!pixKey.trim()) {
      setShowError('Digite sua chave PIX')
      setTimeout(() => setShowError(''), 3000)
      return
    }

    const result = onWithdraw(amount, pixKey, pixType)
    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setWithdrawAmount('')
        setPixKey('')
        setActiveSection('main')
      }, 2000)
    } else {
      setShowError(result.error || 'Erro ao processar saque')
      setTimeout(() => setShowError(''), 3000)
    }
  }

  const copyPixCode = () => {
    if (currentDeposit?.pixCode) {
      navigator.clipboard.writeText(currentDeposit.pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderMain = () => (
    <div className="animate-fade-in">
      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-2xl font-bold text-white">{user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name || user.email.split('@')[0]}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Hash className="w-3 h-3 text-primary-500" />
              <span className="text-primary-500 text-xs font-mono">{user.displayId}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-600/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Saldo Disponível</p>
              <p className="text-2xl font-bold text-white">R$ {user.balance.toFixed(2)}</p>
            </div>
            <Wallet className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setActiveSection('deposit')}
          className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-dark-600 transition-all"
        >
          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
            <ArrowDownCircle className="w-6 h-6 text-primary-500" />
          </div>
          <span className="text-white font-semibold">Depositar</span>
        </button>

        <button
          onClick={() => setActiveSection('withdraw')}
          className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-dark-600 transition-all"
        >
          <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
            <ArrowUpCircle className="w-6 h-6 text-primary-500" />
          </div>
          <span className="text-white font-semibold">Sacar</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <a
          href="https://t.me/+qasEE92ROa5iOTYx"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-dark-600 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-primary-500" />
          <span className="text-white text-sm font-medium">Grupo Oficial</span>
        </a>

        <a
          href="https://t.me/+5598981275486"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-dark-600 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-primary-500" />
          <span className="text-white text-sm font-medium">Suporte</span>
        </a>
      </div>

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 mb-4">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-primary-500" />
          Histórico Financeiro
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveSection('deposits-history')}
            className="bg-dark-600/50 hover:bg-dark-500 rounded-xl p-4 text-center transition-all"
          >
            <ArrowDownCircle className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-white font-medium text-sm">Depósitos</p>
            <p className="text-gray-500 text-xs">{user.deposits.length} registros</p>
          </button>

          <button
            onClick={() => setActiveSection('withdrawals-history')}
            className="bg-dark-600/50 hover:bg-dark-500 rounded-xl p-4 text-center transition-all"
          >
            <ArrowUpCircle className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-white font-medium text-sm">Saques</p>
            <p className="text-gray-500 text-xs">{user.withdrawals.length} registros</p>
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-dark-700/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        <span className="text-red-500 font-semibold">Sair da Conta</span>
      </button>
    </div>
  )

const renderDeposit = () => (
    <div className="animate-slide-up">
      <button
        onClick={() => {
          setActiveSection('main')
          setDepositAmount('')
          setCurrentDeposit(null)
        }}
        className="text-gray-400 mb-4 hover:text-white transition-colors"
      >
        ← Voltar
      </button>

      <h2 className="text-xl font-bold text-white mb-6">Depositar</h2>

      {showError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400 text-sm">{showError}</p>
        </div>
      )}

      {showSuccess && (
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
          <CheckCircle className="w-5 h-5 text-primary-500" />
          <p className="text-primary-400 text-sm">Depósito confirmado com sucesso!</p>
        </div>
      )}

      <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Valor do Depósito</label>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="R$ 30,00"
          className="w-full bg-dark-600 border border-dark-500 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
        />
      </div>

      <button
        onClick={handleDeposit}
        className="w-full bg-primary-500 hover:bg-primary-600 rounded-xl py-4 text-white font-semibold transition-all"
      >
        Gerar PIX
      </button>

      {currentDeposit && (
        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">PIX gerado</span>
            <span
              className="text-primary-500 text-sm cursor-pointer"
              onClick={copyPixCode}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </span>
          </div>
          <p className="text-white break-all">{currentDeposit.pixCode}</p>
          <button
            onClick={handleConfirmDeposit}
            className="mt-4 w-full bg-primary-500 hover:bg-primary-600 rounded-xl py-3 text-white font-semibold transition-all"
          >
            Confirmar Depósito
          </button>
        </div>
      )}
    </div>
  )

  const renderWithdraw = () => {
    const withdrawCheck = canWithdrawNow()
    const fee = parseFloat(withdrawAmount) * 0.10 || 0
    const netAmount = (parseFloat(withdrawAmount) || 0) - fee

    return (
      <div className="animate-slide-up">
        <button
          onClick={() => {
            setActiveSection('main')
            setWithdrawAmount('')
            setPixKey('')
          }}
          className="text-gray-400 mb-4 hover:text-white transition-colors"
        >
          ← Voltar
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Sacar via PIX</h2>

        {!withdrawCheck.allowed && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4 flex items-start gap-3 animate-slide-down">
            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Fora do horário de saque</p>
              <p className="text-gray-400 text-xs">{withdrawCheck.message}</p>
            </div>
          </div>
        )}

        {showError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400 text-sm">{showError}</p>
          </div>
        )}

        {showSuccess && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4 flex items-center gap-3 animate-slide-down">
            <CheckCircle className="w-5 h-5 text-primary-500" />
            <p className="text-primary-400 text-sm">Saque solicitado com sucesso!</p>
          </div>
        )}

        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Saldo disponível</span>
            <span className="text-white font-bold">R$ {user.balance.toFixed(2)}</span>
          </div>
        </div>

        {/* BLOCO PIX COMEÇA AQUI */}
        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
          <label className="text-gray-400 text-sm mb-3 block">Tipo de chave PIX</label>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setPixType('cpf')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === 'cpf' ? 'bg-primary-500/20 border border-primary-500' : 'bg-dark-600 border border-dark-500'
              }`}
            >
              <CreditCard className={`w-5 h-5 ${pixType === 'cpf' ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${pixType === 'cpf' ? 'text-primary-400' : 'text-gray-400'}`}>CPF</span>
            </button>

            <button
              onClick={() => setPixType('email')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === 'email' ? 'bg-primary-500/20 border border-primary-500' : 'bg-dark-600 border border-dark-500'
              }`}
            >
              <Mail className={`w-5 h-5 ${pixType === 'email' ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${pixType === 'email' ? 'text-primary-400' : 'text-gray-400'}`}>Email</span>
            </button>

            <button
              onClick={() => setPixType('phone')}
              className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                pixType === 'phone' ? 'bg-primary-500/20 border border-primary-500' : 'bg-dark-600 border border-dark-500'
              }`}
            >
              <Phone className={`w-5 h-5 ${pixType === 'phone' ? 'text-primary-500' : 'text-gray-400'}`} />
              <span className={`text-xs ${pixType === 'phone' ? 'text-primary-400' : 'text-gray-400'}`}>Telefone</span>
            </button>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Chave PIX ({pixType.toUpperCase()})
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={
                pixType === 'cpf' ? '000.000.000-00' :
                pixType === 'email' ? 'seu@email.com' :
                '(00) 00000-0000'
              }
              className="w-full bg-dark-600 border border-dark-500 rounded-xl py-4 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Taxa</span>
            <span className="text-white text-sm">R$ {fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Você receberá</span>
            <span className="text-white font-bold">R$ {netAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          className="w-full bg-primary-500 hover:bg-primary-600 rounded-xl py-4 text-white font-semibold transition-all"
        >
          Solicitar Saque
        </button>
      </div>
    )
  }

  const renderDepositsHistory = () => (
    <div>
      <button
        onClick={() => setActiveSection('main')}
        className="text-gray-400 mb-4 hover:text-white transition-colors"
      >
        ← Voltar
      </button>
      <h2 className="text-xl font-bold text-white mb-4">Histórico de Depósitos</h2>
      {user.deposits.length === 0 && <p className="text-gray-400">Nenhum depósito realizado.</p>}
      {user.deposits.map((d) => (
        <div key={d.id} className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-2 flex justify-between items-center">
          <span className="text-white font-medium">R$ {d.amount.toFixed(2)}</span>
          <span className="text-gray-400 text-xs">{new Date(d.date).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )

  const renderWithdrawalsHistory = () => (
    <div>
      <button
        onClick={() => setActiveSection('main')}
        className="text-gray-400 mb-4 hover:text-white transition-colors"
      >
        ← Voltar
      </button>
      <h2 className="text-xl font-bold text-white mb-4">Histórico de Saques</h2>
      {user.withdrawals.length === 0 && <p className="text-gray-400">Nenhum saque realizado.</p>}
      {user.withdrawals.map((w) => (
        <div key={w.id} className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl p-4 mb-2 flex justify-between items-center">
          <span className="text-white font-medium">R$ {w.amount.toFixed(2)}</span>
          <span className={`text-xs ${w.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}`}>{w.status}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="px-4 py-6">
      {activeSection === 'main' && renderMain()}
      {activeSection === 'deposit' && renderDeposit()}
      {activeSection === 'withdraw' && renderWithdraw()}
      {activeSection === 'deposits-history' && renderDepositsHistory()}
      {activeSection === 'withdrawals-history' && renderWithdrawalsHistory()}
    </div>
  )
            }
