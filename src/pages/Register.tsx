import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Users, AlertCircle, CheckCircle, User } from 'lucide-react'
import { Toast } from '../components/Toast'
import { Logo } from '../components/Logo'

interface RegisterProps {
  onRegister: (name: string, email: string, password: string, inviteCode?: string) => { success: boolean; error?: string }
  onGoToLogin: () => void
  initialInviteCode?: string
}

export function Register({ onRegister, onGoToLogin, initialInviteCode = '' }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState(initialInviteCode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const passwordsMatch = password === confirmPassword
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Digite seu nome')
      return
    }

    if (!passwordsMatch) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    const result = onRegister(name, email, password, inviteCode || undefined)

    if (!result.success) {
      setError(result.error || 'Erro ao criar conta')
      setIsLoading(false)
    } else {
      setShowSuccessToast(true)
      setTimeout(() => {
        setIsLoading(false)
        onGoToLogin()
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Toast
        message="Conta criada!"
        subMessage="Parabéns! Seu cadastro foi realizado com sucesso"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Monety</h1>
          <p className="text-gray-400 mt-2">Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              className="w-full bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Criar senha"
              className="w-full bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              className={`w-full bg-dark-700/80 backdrop-blur-sm border rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none transition-all ${showPasswordError ? 'border-red-500' : confirmPassword && passwordsMatch ? 'border-primary-500' : 'border-dark-600 focus:border-primary-500'
                }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {showPasswordError && (
            <div className="flex items-center gap-2 text-red-400 text-sm animate-slide-down">
              <AlertCircle className="w-4 h-4" />
              <span>As senhas não coincidem</span>
            </div>
          )}

          {confirmPassword && passwordsMatch && (
            <div className="flex items-center gap-2 text-primary-400 text-sm animate-slide-down">
              <CheckCircle className="w-4 h-4" />
              <span>Senhas coincidem</span>
            </div>
          )}

          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Código de convite (opcional)"
              className="w-full bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || showPasswordError}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/30"
          >
            {isLoading ? 'Criando conta...' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Já tem uma conta?{' '}
            <button
              onClick={onGoToLogin}
              className="text-primary-500 font-semibold hover:text-primary-400 transition-colors"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
