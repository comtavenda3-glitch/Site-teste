import React, { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  subMessage?: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, subMessage, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="bg-dark-800 border border-primary-500/30 rounded-2xl p-6 shadow-2xl shadow-primary-500/20 pointer-events-auto animate-toast-in max-w-sm w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
            <CheckCircle className="w-10 h-10 text-primary-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
          {subMessage && (
            <p className="text-gray-400 text-sm">{subMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}
