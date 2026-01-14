import { useState, useEffect } from 'react'
import { GraduationCap, Sparkles, Award, Star, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
type ConfettiItem = {
  id: number
  left: number
  delay: number
  duration: number
  rotation: number
  color: string
}
export function GraduatedBanner() {
  const [confetti, setConfetti] = useState<ConfettiItem[]>([])
  const [showAnimation, setShowAnimation] = useState<boolean>(true)

  useEffect(() => {
    // Gerar confetes
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
      color: [
        'bg-yellow-400',
        'bg-emerald-400',
        'bg-blue-400',
        'bg-pink-400',
        'bg-purple-400',
      ][Math.floor(Math.random() * 5)],
    }))
    setConfetti(newConfetti)

    // Remover animação após 5 segundos
    const timer = setTimeout(() => setShowAnimation(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="relative overflow-hidden border-2 border-emerald-500/20 shadow-lg">
      {/* Confetes animados */}
      {showAnimation && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {confetti.map((conf) => (
            <div
              key={conf.id}
              className={`absolute h-3 w-3 ${conf.color} rounded-sm opacity-80`}
              style={{
                left: `${conf.left}%`,
                top: '-10%',
                animation: `fall ${conf.duration}s linear ${conf.delay}s infinite`,
                transform: `rotate(${conf.rotation}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Padrão decorativo de fundo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-600" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-green-600" />
      </div>

      {/* Estrelas flutuantes */}
      {showAnimation && (
        <>
          <Star
            className="absolute left-10 top-8 h-6 w-6 animate-pulse text-yellow-400"
            fill="currentColor"
          />
          <Star
            className="absolute right-16 top-12 h-4 w-4 animate-pulse text-emerald-400"
            fill="currentColor"
            style={{ animationDelay: '0.5s' }}
          />
          <Star
            className="absolute right-8 bottom-16 h-5 w-5 animate-pulse text-blue-400"
            fill="currentColor"
            style={{ animationDelay: '1s' }}
          />
          <Star
            className="absolute left-20 bottom-10 h-4 w-4 animate-pulse text-pink-400"
            fill="currentColor"
            style={{ animationDelay: '0.8s' }}
          />
        </>
      )}

      <CardContent className="relative space-y-5 p-6">
        {/* Cabeçalho com gradiente */}
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
            <GraduationCap
              className={`h-7 w-7 text-white ${showAnimation ? 'animate-bounce' : ''}`}
              strokeWidth={2.5}
            />
            <Sparkles
              className="absolute -right-1 -top-1 h-4 w-4 text-yellow-400 animate-pulse"
              fill="currentColor"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">
                Plano curricular concluído com sucesso
              </h3>
              <span
                className={`text-2xl ${showAnimation ? 'animate-bounce' : ''}`}
              >
                🎓
              </span>
            </div>
          </div>
        </div>

        {/* Divisor decorativo */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

        {/* Mensagem de parabéns */}
        <div className="rounded-xl  p-6 text-center shadow-inner">
          <div className="mb-3 flex justify-center gap-2">
            <Trophy
              className={`h-8 w-8 text-emerald-600 ${showAnimation ? 'animate-bounce' : ''}`}
              style={{ animationDelay: '0.1s' }}
            />
            <Award
              className={`h-8 w-8 text-yellow-500 ${showAnimation ? 'animate-bounce' : ''}`}
              style={{ animationDelay: '0.2s' }}
            />
            <Trophy
              className={`h-8 w-8 text-emerald-600 ${showAnimation ? 'animate-bounce' : ''}`}
              style={{ animationDelay: '0.3s' }}
            />
          </div>

          <h2 className="mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-3xl font-bold text-transparent">
            Parabéns! 🎉
          </h2>

          <p className="text-lg font-semibold text-emerald-700">
            Você alcançou um marco importante na sua jornada académica!
          </p>

          <p className="mt-3 text-sm text-emerald-600">
            Todo o esforço e dedicação valeram a pena. Este é apenas o começo de
            grandes conquistas!
          </p>

          {/* Badge de conquista */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 py-2.5 px-6 text-sm font-bold text-white shadow-lg transform transition-transform hover:scale-105">
            <Award className="h-4 w-4" />
            GRADUADO COM SUCESSO
          </div>
        </div>

        {/* Rodapé inspirador */}
        <div className="text-center">
          <p className="text-xs italic text-emerald-600">
            ✨ "O sucesso é a soma de pequenos esforços repetidos dia após dia"
            ✨
          </p>
        </div>
      </CardContent>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </Card>
  )
}
