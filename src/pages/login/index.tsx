'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ModeToggle } from '@/components/mode-toggle'
import { LoginForm } from './components/login-form'
import { LogoBackground } from './components/logo-background'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RegisterForm } from './components/register-form'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function Login() {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    setTheme('light')
  }
  useEffect(() => {
    toggleTheme()
  }, [theme])
  return (
    <div className="flex min-h-screen items-center relative justify-center bg-gradient-to-br from-background to-muted p-4">
      <LogoBackground top="2.5rem" right="2.5rem" />
      <LogoBackground bottom="2.5rem" left="2.5rem" />
      <Card className="w-full max-w-md  relative z-10">
        <div className="absolute right-4 top-4 z-10">
          <ModeToggle />
        </div>
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img
              src="/logo_uma.webp"
              alt="Universidade Metodista de Angola"
              className="h-24 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Portal Universitário</CardTitle>
          <CardDescription>Acesse sua conta acadêmica</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="min-w-full" value="login">
                Entrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
