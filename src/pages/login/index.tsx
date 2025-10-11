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

export function Login() {
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
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
