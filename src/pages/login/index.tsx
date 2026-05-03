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

import { FileSearch } from 'lucide-react'

// ───────────────────────────────────────────────
import { APP_ENV, isDevelop, isPrePrd } from '@/config/env'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RegisterForm } from './components/register-form'
import ValidarDocumentos from './components/ValidarDocumentos'
// ───────────────────────────────────────────────

// ─── Controla visibilidade da aba de registo ───
const SHOW_REGISTER_TAB = true // muda para false para ocultar o registo

export function Login() {
  const { setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<'login' | 'forgot' | 'validar'>('login')
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')

  useEffect(() => {
    setTheme('light')
  }, [])

  const showEnvLabel = isDevelop || isPrePrd

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
          <Tabs
            value={authTab}
            onValueChange={(v) => setAuthTab(v as 'login' | 'register')}
            className="w-full"
          >
            {SHOW_REGISTER_TAB && (
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Registrar</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="login">
              {activeTab === 'login' && (
                <>
                  <LoginForm />

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
              )}

              {activeTab === 'forgot' && (
                <div className="space-y-6">
                  <ForgotPasswordFlow onBack={() => setActiveTab('login')} />
                </div>
              )}

              {activeTab === 'validar' && (
                <div className="space-y-6">
                  <ValidarDocumentos onBack={() => setActiveTab('login')} />
                </div>
              )}
            </TabsContent>

            {SHOW_REGISTER_TAB && (
              <TabsContent value="register">
                <RegisterForm onSuccess={() => setAuthTab('login')} />
              </TabsContent>
            )}
          </Tabs>

          {/* ─── Link Validar Documentos ─── */}
          {activeTab === 'login' && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('validar')}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                <FileSearch className="h-3 w-3" />
                Validar Documentos
              </button>
            </div>
          )}
        </CardContent>

        {/* ─── Label de ambiente (só develop / pre-prd) ─── */}
        {showEnvLabel && (
          <div className="pb-6 pt-2 text-center text-xs text-muted-foreground/50">
            {envDisplay}
          </div>
        )}
      </Card>
    </div>
  )
}