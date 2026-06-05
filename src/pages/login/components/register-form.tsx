'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,

  Mail,
  Phone,
  Hash,
  User,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ClipboardList,
  IdCard,
  Info,
  UserPlus,
  Loader2,
} from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BackButton, PrimaryButton } from '..'
import { useRegisterForm } from '../use-register-form'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'

// ---------------------------------------------------------------------------
// Types / View
// ---------------------------------------------------------------------------

type View = 'login' | 'forgot' | 'update-request' | 'validate-doc' | 'register'

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const registerSchema = z
  .object({
    nomeCompleto: z.string().min(3, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().min(9, 'Telefone inválido').max(20),
    faculdade: z.string().min(1, 'Seleccione a faculdade'),
    tipoCandidatura: z.string().min(1, 'Seleccione o tipo de candidatura'),
    tipoDocumento: z.string().min(1, 'Seleccione o tipo de documento'),
    numeroDocumento: z.string().min(3, 'Número de documento obrigatório'),
    senha: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RegisterFormProps {
  setView: (v: View) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RegisterForm({ setView }: RegisterFormProps) {
  const [sent, setSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Hook com a lógica de API e opções dos selects
  const {
    onSubmit: submitToApi,
    faculdadesOptions,
    tipoCandidaturaOptions,
    tipoDocumentoOptions,
    createBeginningStudentProcessPending,
  } = useRegisterForm()

  const { data: prazoResponse } = useGetPrazoPorTipo({
    tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
  })
  const REGISTRATION_OPEN = prazoResponse?.podeInscrever ?? false

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      faculdade: '',
      tipoCandidatura: '',
      tipoDocumento: '',
      numeroDocumento: '',
      senha: '',
      confirmarSenha: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await submitToApi({
        name: data.nomeCompleto,
        email: data.email,
        telefone: data.telefone,
        faculdade: data.faculdade,
        grauacademico: data.tipoCandidatura,
        tipo_de_documento: data.tipoDocumento,
        numero_documento: data.numeroDocumento,
        password: data.senha,
        confirmar_senha: data.confirmarSenha,
      })
      form.reset()
      setSent(true)
    } catch {
      // erros tratados dentro do hook
    }
  }

  // -------------------------------------------------------------------------
  // STATE: Período fechado
  // -------------------------------------------------------------------------

  if (!REGISTRATION_OPEN) {
    return (
      <>
        <BackButton onClick={() => setView('login')} />
        <div className="space-y-2">
          <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
            Candidaturas encerradas
          </h2>
          <p className="text-sm text-muted-foreground">
            O período de candidaturas não está activo neste momento.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Info className="h-5 w-5" />
            Inscrições temporariamente indisponíveis
          </div>
          <p>
            As inscrições para novos estudantes só estão abertas em
            determinadas épocas do ano académico. Acompanhe os comunicados
            oficiais da Universidade Metodista de Angola para saber a próxima
            data de abertura.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setView('login')}
          className="w-full"
        >
          Voltar ao login
        </Button>
      </>
    )
  }

  // -------------------------------------------------------------------------
  // STATE: Candidatura enviada com sucesso
  // -------------------------------------------------------------------------

  if (sent) {
    return (
      <>
        <BackButton onClick={() => setView('login')} />
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-base">
            <CheckCircle2 className="h-5 w-5" />
            Candidatura submetida
          </div>
          <p>
            Recebemos a sua candidatura. Os Serviços Académicos irão validar
            os dados e enviar as próximas instruções para o e-mail informado.
          </p>
          <Button
            variant="outline"
            onClick={() => setView('login')}
            className="w-full"
          >
            Voltar ao login
          </Button>
        </div>
      </>
    )
  }

  // -------------------------------------------------------------------------
  // STATE: Formulário
  // -------------------------------------------------------------------------

  const isSubmitting = createBeginningStudentProcessPending || form.formState.isSubmitting

  return (
    <>
      <BackButton onClick={() => setView('login')} />

      <div className="space-y-2">
        <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
          Criar a sua conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha os dados para iniciar o processo de candidatura.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome completo */}
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="ex: João Manuel Silva"
                      disabled={isSubmitting}
                      className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* E-mail + Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu@mail.com"
                        disabled={isSubmitting}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="+244 9XX XXX XXX"
                        disabled={isSubmitting}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tipo de Candidatura + Faculdade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipoCandidatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de candidatura</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Seleccione o tipo" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoCandidaturaOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faculdade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculdade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Seleccione a faculdade" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {faculdadesOptions.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tipo de Documento + Número */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-2">
                          <IdCard className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Seleccione" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoDocumentoOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numeroDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº do documento</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="ex: 000000000LA000"
                        disabled={isSubmitting}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Senha + Confirmar Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'A criar conta...' : 'Criar a sua conta'}
          </PrimaryButton>
        </form>
      </Form>
    </>
  )
}