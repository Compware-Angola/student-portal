'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  GraduationCap,
  Send,
  User,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { LogoBackground } from '../login/components/logo-background'


// ─────────────────────────────────────────────────────────────────────────────
//  Particle explosion success screen
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'star' | 'square'
}

const COLORS = [
  '#10b981', '#34d399', '#6ee7b7',  // emerald
  '#f59e0b', '#fbbf24', '#fcd34d',  // amber
  '#3b82f6', '#60a5fa', '#93c5fd',  // blue
  '#a78bfa', '#c4b5fd',             // violet
  '#f472b6', '#fb7185',             // pink/rose
]

function SuccessScreen({
  email,
  onBackToLogin,
}: {
  email: string
  onBackToLogin?: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const [visible, setVisible] = useState(false)

  // Fade-in card after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Particle burst on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn particles from center
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const burst = (count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 4 + Math.random() * 10
        const shapes: Particle['shape'][] = ['circle', 'star', 'square']
        particlesRef.current.push({
          id: i,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          size: 5 + Math.random() * 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: 1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        })
      }
    }

    burst(120)
    // Second smaller burst after short delay
    const t2 = setTimeout(() => burst(60), 300)

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number
    ) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const innerAngle = outerAngle + (2 * Math.PI) / 10
        if (i === 0) ctx.moveTo(x + r * Math.cos(outerAngle), y + r * Math.sin(outerAngle))
        else ctx.lineTo(x + r * Math.cos(outerAngle), y + r * Math.sin(outerAngle))
        ctx.lineTo(x + (r / 2) * Math.cos(innerAngle), y + (r / 2) * Math.sin(innerAngle))
      }
      ctx.closePath()
      ctx.fill()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0.02)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.25 // gravity
        p.vx *= 0.99
        p.opacity -= 0.013
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.size / 2)
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        }

        ctx.restore()
      }

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(t2)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Particle canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
      />

      {/* Card — fades + slides up on mount */}
      <div
        className="relative z-10 w-full max-w-lg transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <Card className="text-center shadow-2xl">
          <CardContent className="pb-10 pt-10 space-y-4">
            {/* Pulsing check icon */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              {/* Outer pulse rings */}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
              <span
                className="absolute inline-flex h-[85%] w-[85%] animate-ping rounded-full bg-emerald-400 opacity-15"
                style={{ animationDelay: '0.15s' }}
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                {/* Animated check — draws itself via stroke-dashoffset */}
                <svg
                  viewBox="0 0 52 52"
                  className="h-10 w-10"
                  style={{ overflow: 'visible' }}
                >
                  <circle
                    cx="26"
                    cy="26"
                    r="24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    style={{
                      strokeDasharray: 160,
                      strokeDashoffset: 0,
                      animation: 'drawCircle 0.5s ease-out forwards',
                    }}
                  />
                  <path
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27 l8 8 l16 -16"
                    style={{
                      strokeDasharray: 40,
                      strokeDashoffset: 40,
                      animation: 'drawCheck 0.4s 0.4s ease-out forwards',
                    }}
                  />
                </svg>
              </div>
            </div>

            <h2
              className="text-2xl font-bold"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s 0.2s, transform 0.5s 0.2s',
              }}
            >
              Conta Criada!
            </h2>

            <p
              className="mx-auto max-w-sm text-muted-foreground"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s 0.35s',
              }}
            >
              O seu registo foi concluido com sucesso.
            </p>

            <p
              className="text-xs text-muted-foreground"
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s 0.45s',
              }}
            >
              Recebera uma confirmacao no email{' '}
              <strong>{email}</strong>
            </p>

            {onBackToLogin && (
              <div
                style={{
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 0.5s 0.6s',
                }}
              >
                <Button
                  variant="outline"
                  className="mt-2 gap-2"
                  onClick={onBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Ir para o Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes drawCircle {
          from { stroke-dashoffset: 160; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Register
// ─────────────────────────────────────────────────────────────────────────────

interface RegisterProps {
  /** Called when the user clicks "Ja tenho conta" */
  onBackToLogin?: () => void
}

export function Register({ onBackToLogin }: RegisterProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    estadoCivil: '',
    nacionalidade: '',
    bilheteIdentidade: '',
    telefone: '',
    telefoneEmergencia: '',
    email: '',
    password: '',
    confirmarPassword: '',
    morada: '',
   
  })

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const obrigatorios: (keyof typeof formData)[] = [
      'nomeCompleto',
      'dataNascimento',
      'sexo',
      'bilheteIdentidade',
      'email',
      'telefone',
      'password',
      'confirmarPassword',
    ]

    const faltam = obrigatorios.filter((f) => !formData[f])
    if (faltam.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatorios.')
      return
    }

    if (formData.password !== formData.confirmarPassword) {
      toast.error('As palavras-passe nao coincidem.')
      return
    }

    if (formData.password.length < 8) {
      toast.error('A palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast.success('Conta criada com sucesso!')
    }, 1500)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <SuccessScreen email={formData.email} onBackToLogin={onBackToLogin} />
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="mx-auto max-w-3xl space-y-6">

          <LogoBackground top="2.5rem" right="2.5rem" />
             <LogoBackground bottom="2.5rem" left="2.5rem" />
    

        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Criar Conta</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Preencha o formulario abaixo para criar a sua conta no Portal
            Universitario. Os campos marcados com{' '}
            <span className="text-red-500">*</span> sao obrigatorios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Informacoes de identificacao e contacto
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nomeCompleto">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nomeCompleto"
                  placeholder="Ex: Joao Manuel da Silva"
                  value={formData.nomeCompleto}
                  onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">
                  Data de Nascimento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange('dataNascimento', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Sexo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(v) => handleChange('sexo', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado Civil</Label>
                <Select
                  value={formData.estadoCivil}
                  onValueChange={(v) => handleChange('estadoCivil', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viuvo(a)">Viuvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Input
                  id="nacionalidade"
                  placeholder="Ex: Angolana"
                  value={formData.nacionalidade}
                  onChange={(e) => handleChange('nacionalidade', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bilheteIdentidade">
                  No Bilhete de Identidade{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bilheteIdentidade"
                  placeholder="Ex: 000000000LA000"
                  value={formData.bilheteIdentidade}
                  onChange={(e) => handleChange('bilheteIdentidade', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefone"
                  placeholder="+244 9XX XXX XXX"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneEmergencia">
                  Telefone de Emergencia
                </Label>
                <Input
                  id="telefoneEmergencia"
                  placeholder="+244 9XX XXX XXX"
                  value={formData.telefoneEmergencia}
                  onChange={(e) => handleChange('telefoneEmergencia', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Palavra-passe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarPassword">
                  Confirmar Palavra-passe{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmarPassword"
                  type="password"
                  placeholder="Repita a palavra-passe"
                  value={formData.confirmarPassword}
                  onChange={(e) => handleChange('confirmarPassword', e.target.value)}
                />
              </div>



            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            {onBackToLogin && (
              <Button
                type="button"
                variant="ghost"
                className="gap-2"
                onClick={onBackToLogin}
              >
                <ArrowLeft className="h-4 w-4" />
                Ja tenho conta
              </Button>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="gap-2 sm:ml-auto"
            >
              {isSubmitting ? (
                'A registar...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Criar Conta
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}