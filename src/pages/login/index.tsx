'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
//import { ModeToggle } from '@/components/mode-toggle'
import { LoginForm } from './components/login-form'
import { LogoBackground } from './components/logo-background'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

import { useEffect, useState } from 'react'
import { ForgotPasswordFlow } from './components/forgot-password-flow'

export function Login() {
  const {setTheme} = useTheme()
  const [activeTab, setActiveTab] = useState<'login' | 'forgot'>('login')
  useEffect(() => {
    setTheme('light')
  },[])

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-gradient-to-br from-background to-muted p-4">
      <LogoBackground top="2.5rem" right="2.5rem" />
      <LogoBackground bottom="2.5rem" left="2.5rem" />

      <Card className="w-full max-w-md relative z-10">
        {/* Botão de tema */}
        {/* <div className="absolute right-4 top-4 z-10">
          <ModeToggle />
        </div> */}

        {/* Header */}
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="flex justify-center">
            <img
              src="/logo_uma.webp"
              alt="Universidade Metodista de Angola"
              className="h-24 w-auto"
            />
          </div>

          <CardTitle className="text-2xl">
            {activeTab === 'forgot' ? 'Recuperar Senha' : 'Portal Universitário'}
          </CardTitle>

          <CardDescription>
            {activeTab === 'forgot'
              ? 'Informe seu e-mail institucional para continuar'
              : 'Acesse sua conta acadêmica'}
          </CardDescription>
        </CardHeader>

        {/* Conteúdo */}
        <CardContent>
          {activeTab === 'login' ? (
            <>
              <LoginForm />

              {/* Link destacado para recuperar senha */}
              <div className="mt-8 text-center">
                <Button
                  variant="link"
                  className="text-primary font-medium text-base hover:underline"
                  onClick={() => setActiveTab('forgot')}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
            </>
          ) : (
            /* TELA DE RECUPERAÇÃO DE SENHA */
            <div className="space-y-6">


              {/* Fluxo completo de recuperação */}
              <ForgotPasswordFlow onBack={() => setActiveTab('login')} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}