import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { Toast } from '../components/Toast'
import { Logo } from '../components/Logo'

interface LoginProps {
  onLogin: (email: string, password: string) => { success: boolean; error?: string }
  onGoToRegister: () => void
}

export function Login({ onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = onLogin(email, password)

    if (!result.success) {
      setError(result.error || 'Erro ao fazer login')
      setIsLoading(false)
    } else {
      setShowSuccessToast(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Toast
        message="Login realizado!"
        subMessage="Bem-vindo de volta ao Monety"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Monety</h1>
          <p className="text-gray-400 mt-2">Investimentos Inteligentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

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
              placeholder="Sua senha"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-4 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/30"
          >
            {isLoading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={onGoToRegister}
              className="text-primary-500 font-semibold hover:text-primary-400 transition-colors"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
