import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useResetPasswordForm } from './useResetPasswordForm'
import studentsPhoto from "@/assets/black-students.jpg";
import { LogoBackground } from './logo-background'


export default function RenovarSenha() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { form, onSubmit } = useResetPasswordForm(token)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: any) => {
    await onSubmit(data)
    setSuccess(true)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[6fr_4fr] bg-white">
      {/* LEFT — foto + overlay */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden text-white p-12 min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studentsPhoto})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(110, 15, 15, 0.65)' }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
          aria-hidden
        />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Portal do <span style={{ color: '#F5A623' }}>Estudante</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/90">
            Recupere o acesso à sua conta e continue a acompanhar a sua vida académica.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/75">
            © {new Date().getFullYear()} Universidade Metodista de Angola
          </p>
        </div>
      </aside>

      {/* RIGHT — formulário */}
      <main className="relative flex items-center justify-center p-6 sm:p-10 bg-white overflow-hidden">
        <LogoBackground top="2.5rem" right="2.5rem" />
        <LogoBackground bottom="2.5rem" left="2.5rem" />

        <div className="relative w-full max-w-md space-y-6">
          {/* Banner mobile */}
          <div className="lg:hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-2 relative h-56 overflow-hidden text-white">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${studentsPhoto})` }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(110, 15, 15, 0.65)' }}
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <h1 className="text-2xl font-bold leading-tight">
                Portal do <span style={{ color: '#F5A623' }}>Estudante</span>
              </h1>
              <p className="text-xs text-white/85 mt-1">
                Universidade Metodista de Angola
              </p>
            </div>
          </div>

          {success ? (
            <SuccessState onLogin={() => navigate('/login')} />
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
                  Renovar senha
                </h2>
                <p className="text-sm text-muted-foreground">
                  Crie uma nova senha segura para acessar sua conta.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  <PasswordField
                    control={form.control}
                    name="novaSenha"
                    label="Nova Senha"
                    placeholder="••••••••••••"
                  />
                  <PasswordField
                    control={form.control}
                    name="repetirSenha"
                    label="Repetir Nova Senha"
                    placeholder="••••••••••••"
                  />

                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Uma letra maiúscula</li>
                    <li>Um número</li>
                    <li>Um caractere especial</li>
                  </ul>

                  <PrimaryButton
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Spinner />
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Confirmar Nova Senha
                      </>
                    )}
                  </PrimaryButton>
                </form>
              </Form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar ao login
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function PasswordField({
  control,
  name,
  label,
  placeholder,
}: {
  control: any
  name: 'novaSenha' | 'repetirSenha'
  label: string
  placeholder: string
}) {
  const [show, setShow] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                {...field}
                type={show ? 'text' : 'password'}
                autoComplete={name === 'novaSenha' ? 'new-password' : 'off'}
                placeholder={placeholder}
                className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SuccessState({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800 space-y-3">
        <div className="flex items-center gap-2 font-semibold text-base">
          <CheckCircle2 className="h-5 w-5" />
          Senha renovada com sucesso
        </div>
        <p>
          A sua nova senha foi guardada. Pode agora fazer login com as credenciais actualizadas.
        </p>
      </div>
      <button
        type="button"
        onClick={onLogin}
        className="inline-flex w-full items-center justify-center h-11 rounded-lg text-sm font-medium text-white transition-all hover:-translate-y-0.5"
        style={{
          backgroundColor: '#E02020',
          boxShadow: '0 10px 25px -10px rgba(224, 32, 32, 0.55)',
        }}
      >
        Ir para o login
      </button>
    </div>
  )
}

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        backgroundColor: '#E02020',
        boxShadow: '0 10px 25px -10px rgba(224, 32, 32, 0.55)',
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) e.currentTarget.style.backgroundColor = '#B81818'
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) e.currentTarget.style.backgroundColor = '#E02020'
      }}
    >
      {children}
    </Button>
  )
}