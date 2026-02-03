'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from './components/login-form'
import { LogoBackground } from './components/logo-background'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

import { useEffect, useState } from 'react'
import { ForgotPasswordFlow } from './components/forgot-password-flow'

// ───────────────────────────────────────────────
//  Importa as flags de ambiente
//  (deve existir src/config/env.ts ou similar)
import { APP_ENV, isDevelop, isPrePrd } from '@/config/env'
// ───────────────────────────────────────────────

export function Login() {
  const { setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'login' | 'forgot'>('login')

  useEffect(() => {
    setTheme('light')
  }, [])

  // Mostra a label apenas em develop ou pre-prd
  const showEnvLabel = isDevelop || isPrePrd

  // Texto amigável + "versão" (usa o valor bruto da env)
  const envDisplay = isDevelop
    ? `Ambiente: Desenvolvimento • v${APP_ENV}`
    : isPrePrd
      ? `Ambiente: Pré-produção • v${APP_ENV}`
      : ''

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-gradient-to-br from-background to-muted p-4">
      <LogoBackground top="2.5rem" right="2.5rem" />
      <LogoBackground bottom="2.5rem" left="2.5rem" />

      <Card className="w-full max-w-md relative z-10">
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
            {activeTab === 'forgot'
              ? 'Recuperar Senha'
              : 'Portal Universitário'}
          </CardTitle>

          <CardDescription>
            {activeTab === 'forgot'
              ? 'Informe seu e-mail para continuar'
              : 'Acesse sua conta acadêmica'}
          </CardDescription>
        </CardHeader>

        {/* Conteúdo principal */}
        <CardContent>
          {activeTab === 'login' ? (
            <>
              <LoginForm />

              {/* Link para recuperar senha */}
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
            <div className="space-y-6">
              <ForgotPasswordFlow onBack={() => setActiveTab('login')} />
            </div>
          )}
        </CardContent>

        {/* ─── Label discreta de ambiente (só develop / pre-prd) ─── */}
        {showEnvLabel && (
          <div className="pb-6 pt-2 text-center text-xs text-muted-foreground/50">
            {envDisplay}
          </div>
        )}
      </Card>
    </div>
  )
}