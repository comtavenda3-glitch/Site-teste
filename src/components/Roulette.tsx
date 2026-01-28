import React, { useState } from 'react'
import { Gift, Info, RotateCw } from 'lucide-react'

interface RouletteProps {
  spins: number
  onSpin: () => number | null
}

export function Roulette({ spins, onSpin }: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState < number | null > (null)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // Segmentos com dois tons de verde alternados
  const segments = [
    { value: 1, label: 'R$ 1', color: '#22c55e' },      // Verde claro
    { value: 5, label: 'R$ 5', color: '#15803d' },      // Verde escuro
    { value: 10, label: 'R$ 10', color: '#16a34a' },    // Verde médio
    { value: 15, label: 'R$ 15', color: '#166534' },    // Verde floresta
    { value: 20, label: 'R$ 20', color: '#22c55e' },    // Verde claro
    { value: 35, label: 'R$ 35', color: '#15803d' },    // Verde escuro
    { value: 50, label: 'R$ 50', color: '#16a34a' },    // Verde médio
    { value: 100, label: 'R$ 100', color: '#166534' },  // Verde floresta
  ]

  const segmentAngle = 360 / segments.length

  const handleSpin = () => {
    if (spins <= 0 || isSpinning) return

    setIsSpinning(true)
    setShowResult(false)

    const prize = onSpin()

    if (prize === null) {
      setIsSpinning(false)
      return
    }

    const prizeIndex = segments.findIndex(s => s.value === prize)
    const segmentCenterAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2)
    const targetAngle = 360 - segmentCenterAngle
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360
    const variance = (Math.random() - 0.5) * (segmentAngle * 0.4)
    const finalRotation = rotation + extraSpins + targetAngle + variance

    setRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setResult(prize)
      setShowResult(true)
    }, 4000)
  }

  return (
    <div className="bg-dark-700/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-lg text-white">Roleta Premiada</h3>
        </div>
        <div className="bg-dark-600 px-3 py-1 rounded-full">
          <span className="text-sm text-gray-400">Giros: </span>
          <span className="font-bold text-primary-500">{spins}</span>
        </div>
      </div>

      <div className="bg-dark-600/50 border border-dark-500 rounded-xl p-3 mb-4 flex items-start gap-2">
        <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-primary-500 font-semibold text-sm">Como ganhar giros?</p>
          <p className="text-gray-400 text-xs">
            Ganhe giros ao fazer um <span className="text-primary-500">depósito</span> ou quando um <span className="text-primary-500">convidado nível 1</span> comprar um produto.
          </p>
        </div>
      </div>

      <div className="relative flex justify-center items-center py-6">
        {/* Seta indicadora no topo */}
        <div className="absolute top-2 z-20">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-primary-500 drop-shadow-lg" />
        </div>

        <div className="relative">
          {/* Borda externa com brilho verde */}
          <div className="absolute inset-[-8px] rounded-full bg-gradient-to-b from-primary-400 to-primary-700 opacity-50" />

          {/* Roleta principal */}
          <div
            className="relative w-64 h-64 rounded-full shadow-2xl overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {segments.map((segment, idx) => {
                const startAngle = idx * segmentAngle - 90
                const endAngle = (idx + 1) * segmentAngle - 90
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180

                const x1 = 100 + 100 * Math.cos(startRad)
                const y1 = 100 + 100 * Math.sin(startRad)
                const x2 = 100 + 100 * Math.cos(endRad)
                const y2 = 100 + 100 * Math.sin(endRad)

                const largeArc = segmentAngle > 180 ? 1 : 0
                const pathD = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`

                const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180
                const textX = 100 + 62 * Math.cos(midAngle)
                const textY = 100 + 62 * Math.sin(midAngle)
                const textRotation = (startAngle + endAngle) / 2 + 90

                return (
                  <g key={idx}>
                    <path
                      d={pathD}
                      fill={segment.color}
                      stroke="#0a0a0a"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      {segment.label}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Centro da roleta */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-dark-800 rounded-full border-4 border-primary-500 flex items-center justify-center shadow-lg">
                <RotateCw className={`w-6 h-6 text-primary-500 ${isSpinning ? 'animate-spin' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResult && result !== null && (
        <div className="text-center p-4 rounded-xl mb-4 bg-primary-500/20 border border-primary-500/30 animate-slide-up">
          <p className="text-primary-400 font-medium">Parabéns! Você ganhou</p>
          <p className="text-3xl font-bold text-white">R$ {result.toFixed(2)}</p>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spins <= 0 || isSpinning}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${spins > 0 && !isSpinning
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/30'
            : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
      >
        {isSpinning ? 'Girando...' : 'GIRAR ROLETA'}
      </button>
    </div>
  )
}
