import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  }

  const fontSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)'
      }}
    >
      <span
        className={`${fontSizes[size]} font-extrabold text-white`}
        style={{
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}
      >
        M
      </span>
    </div>
  )
}
