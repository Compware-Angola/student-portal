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
 
 ClipboardList,
  IdCard,
  Info,
  UserPlus,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
} from '@/components/ui/form'
import {
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BackButton, PrimaryButton } from '..'
import { useRegisterForm } from '../use-register-form'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'
import type { PrazoResponse } from '@/services/prazos'
import { InputFormField } from '@/components/input-form-field'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryUsableAcademicYear } from '@/hooks/academic-year/use-query-usable-academic-year'

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
    email: z.email('E-mail inválido'),
    telefone: z.string().min(9, 'Telefone inválido').max(20),
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



export function RegisterForm({ setView }: RegisterFormProps) {
  const [sent, setSent] = useState(false)

    const { data: licenciatura } = useQueryUsableAcademicYear(1)
    const { data: mestrado } = useQueryUsableAcademicYear(2)
    const { data: doutoramento } = useQueryUsableAcademicYear(3)
    const { data: prazoResponseLinceiatura, isLoading: prazoLoadingLinceiatura } =
      useGetPrazoPorTipo({
        codigo_tipo_candidatura: 1,
        tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
        anoLectivo:licenciatura?.data?.codigo
      },
    Boolean(licenciatura?.data?.codigo)
  )

  const { data: prazoResponseMestrado, isLoading: prazoLoadingMestrado } =
    useGetPrazoPorTipo({
      codigo_tipo_candidatura: 2,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo:mestrado?.data?.codigo
    },
    Boolean(mestrado?.data?.codigo)
  )

  const {
    data: prazoResponseDotouramneto,
    isLoading: prazoLoadingDoutoramneto,
  } = useGetPrazoPorTipo({
    codigo_tipo_candidatura: 3,
    tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
    anoLectivo:doutoramento?.data?.codigo
  },
  Boolean(doutoramento?.data?.codigo)
  )
  const prazos = [
    prazoResponseLinceiatura,
    prazoResponseMestrado,
    prazoResponseDotouramneto,
  ]
  const loadings = [
    prazoLoadingLinceiatura,
    prazoLoadingMestrado,
    prazoLoadingDoutoramneto,
  ]
  const REGISTRATION_OPEN =
    loadings.some(Boolean) || prazos.some((prazo) => prazo?.podeInscrever)
  const {
    onSubmit: submitToApi,
    tipoCandidaturaOptions,
    tipoDocumentoOptions,
    createBeginningStudentProcessPending,
  } = useRegisterForm()

  const prazosPorCandidatura: Record<number, PrazoResponse | undefined> = {
    1: prazoResponseLinceiatura,
    2: prazoResponseMestrado,
    3: prazoResponseDotouramneto,
  }

  const tiposDisponiveis = tipoCandidaturaOptions.filter((tipo) => {
    const prazo = prazosPorCandidatura[tipo.value as any]
    return prazo?.podeInscrever === true
  })


  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      tipoCandidatura: '',
      tipoDocumento: '',
      numeroDocumento: '',
      senha: '',
      confirmarSenha: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      let anoLectivoId: number |undefined =undefined
      const tipoCandidatura = Number(tiposDisponiveis.find((t) => t.label === data.tipoCandidatura)?.value)
      if(tipoCandidatura === 1){
        anoLectivoId = licenciatura?.data?.codigo
      }
      if(tipoCandidatura === 2){
        anoLectivoId = mestrado?.data?.codigo
      }
      if(tipoCandidatura === 3){
        anoLectivoId = doutoramento?.data?.codigo
      }
      
      await submitToApi({
        name: data.nomeCompleto,
        email: data.email,
        telefone: data.telefone,
        grauacademico: data.tipoCandidatura,
        tipo_de_documento: data.tipoDocumento,
        numero_documento: data.numeroDocumento,
        password: data.senha,
        confirmar_senha: data.confirmarSenha,
        ano_lectivo_id: anoLectivoId

      })

      form.reset()
      setSent(true)
    } catch {
      
    }
  }

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
          <InputFormField
            control={form.control}
            name="nomeCompleto"
            placeholder="ex: João Manuel Silva"
            label="Nome completo"
            disabled={isSubmitting}
            icon={() => (
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
          />

          {/* E-mail + Telefone */}

            <InputFormField
              control={form.control}
              name="email"
              placeholder="seu@mail.com"
              label="E-mail"
              disabled={isSubmitting}
              icon={() => (
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            />
            <InputFormField
              control={form.control}
              name="telefone"
              placeholder="+244 9XX XXX XXX"
              label="Telefone"
              disabled={isSubmitting}
              icon={() => (
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            />


          

            <SelectFormField
              fullWidth
              control={form.control}
              name="tipoCandidatura"
              items={tiposDisponiveis.map(t=>({label:t.label,value:t.label}))}
              label="Tipo de candidatura"
              trigger={() => (
                <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200 w-full">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Seleccione o tipo" />
                  </div>
                </SelectTrigger>
              )}
            />
            <SelectFormField
              fullWidth
              control={form.control}
              name="tipoDocumento"
              items={tipoDocumentoOptions}
              label="Tipo de documento"
              disabled={isSubmitting}
              trigger={() => (
                <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200 w-full truncate">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <SelectValue
                      placeholder="Seleccione"
                      className="truncate"
                    />
                  </div>
                </SelectTrigger>
              )}
            />
            <InputFormField
              control={form.control}
              name="numeroDocumento"
              placeholder="ex: 000000000LA000"
              label="Nº do documento"
              disabled={isSubmitting}
              icon={() => (
                <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            />

            <InputFormField
              control={form.control}
              name="senha"
              type="password"
              placeholder="••••••••"
              label="Senha"
              disabled={isSubmitting}
              icon={() => (
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            />
            <InputFormField
              control={form.control}
              name="confirmarSenha"
              type="password"
              placeholder="••••••••"
              label="Confirmar senha"
              disabled={isSubmitting}
              icon={() => (
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            />


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
