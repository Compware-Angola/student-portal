'use client'
import { useState } from 'react'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Key,

  Mail,
} from 'lucide-react'
import { toast } from 'sonner'

import { checkEmail, requestPasswordReset } from '@/services/auth/login.service'
import { AtualizacaoDadosSimples } from './update-data'

type Step = 'email' | 'found' | 'not-found'

export function ForgotPasswordFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('E-mail inválido')
      return
    }

    setIsLoading(true)

    try {
      const data = await checkEmail(email.toLowerCase().trim())

      if (data.exists) {
        setStep('found')
        toast.success('E-mail encontrado!')
      } else {
        setStep('not-found')
      }
    } catch (err: any) {
      toast.error('Erro ao verificar e-mail')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      setIsLoading(true)
      await requestPasswordReset(email.toLowerCase().trim())

      toast.success('Link enviado!', {
        icon: <Mail className="h-5 w-5" />,
      })

      setStep('email')
      setEmail('')
    } catch {
      toast.error('Erro ao enviar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Voltar */}
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* STEP: EMAIL */}
      {step === 'email' && (
        <>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Recuperar Senha</CardTitle>
            <CardDescription>Digite seu e-mail</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div>
                <Label>E-mail</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button className="w-full" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Continuar'}
              </Button>
            </form>
          </CardContent>
        </>
      )}

      {/* STEP: FOUND */}
      {step === 'found' && (
        <>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              E-mail encontrado
            </CardTitle>
            <CardDescription>
              Vamos enviar o link de recuperação
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Será enviado para: <b>{email}</b>
              </AlertDescription>
            </Alert>

            <Button onClick={handleResetPassword} className="w-full">
              {isLoading ? 'Enviando...' : 'Enviar link'}
            </Button>

            <Button variant="outline" onClick={() => setStep('email')}>
              Voltar
            </Button>
          </CardContent>
        </>
      )}

      {/* STEP: NOT FOUND */}
      {step === 'not-found' && (
        <>
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              E-mail não encontrado
            </CardTitle>
            <CardDescription>
              Atualize seus dados
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Seu e-mail pode estar desatualizado.
              </AlertDescription>
            </Alert>

            <AtualizacaoDadosSimples emailInicial={email} />

            <Button variant="outline" onClick={() => setStep('email')}>
              Tentar novamente
            </Button>
          </CardContent>
        </>
      )}
    </div>
  )
}