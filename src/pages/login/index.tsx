import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ModeToggle } from '@/components/mode-toggle'
import { LoginForm } from './components/login-form'

export function Login() {
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de login - em produção, conectar ao backend
    navigate('/dashboard')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    // Simulação de registro - em produção, conectar ao backend
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md">
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
