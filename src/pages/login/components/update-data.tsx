import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Send, Mail, Phone, Hash, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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
import { BackButton, PrimaryButton } from '..'
import { sendrenewDataRequest } from '@/services/auth/login.service'

// ---------------------------------------------------------------------------
// Types / View
// ---------------------------------------------------------------------------

type View = 'login' | 'forgot' | 'update-request' | 'validate-doc' | 'register'

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  matricula: z.string().min(4, 'Matrícula inválida').max(20),
  telefone: z.string().min(9, 'Telefone inválido').max(20),
  novoEmail: z.string().email('E-mail inválido'),
  motivos: z
    .string()
    .min(20, 'Descreva os motivos (mín. 20 caracteres)')
    .max(500),
})

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface UpdateRequestFormProps {
  setView: (v: View) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UpdateRequestForm({ setView }: UpdateRequestFormProps) {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { matricula: '', telefone: '', novoEmail: '', motivos: '' },
  })

  const onSubmit = async (data: z.infer<typeof updateSchema>) => {
    setIsLoading(true)

    try {
      await sendrenewDataRequest({
        email: data.novoEmail.trim(),
        enrrolment: data.matricula.trim(),
        phone: data.telefone.trim(),
        details: data.motivos.trim(),
        platform: 'PORTAL',
      })

      setSent(true)
    } catch (err: any) {
      console.error(err)
      toast.error('Falha ao enviar', {
        description: err.message || 'Tente novamente mais tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // -------------------------------------------------------------------------
  // STATE: Solicitação enviada com sucesso
  // -------------------------------------------------------------------------

  if (sent) {
    return (
      <>
        <BackButton onClick={() => setView('login')} />
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-base">
            <CheckCircle2 className="h-5 w-5" />
            Solicitação enviada
          </div>
          <p>
            A sua solicitação foi recebida. Os Serviços Académicos irão
            analisar e responder ao novo e-mail informado em até 72 horas úteis.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
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

  return (
    <>
      <BackButton onClick={() => setView('forgot')} />

      <div className="space-y-2">
        <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
          Solicitar actualização de dados
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha o formulário para que os Serviços Académicos actualizem o
          seu cadastro.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Matrícula */}
          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Matrícula</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="ex: 2024001234"
                      disabled={isLoading}
                      className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
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
                      disabled={isLoading}
                      className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Novo E-mail */}
          <FormField
            control={form.control}
            name="novoEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Novo E-mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="novo.email@exemplo.com"
                      disabled={isLoading}
                      className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Motivos */}
          <FormField
            control={form.control}
            name="motivos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivos</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    disabled={isLoading}
                    placeholder="Descreva o motivo da actualização..."
                    className="flex w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'A enviar...' : 'Enviar solicitação'}
          </PrimaryButton>
        </form>
      </Form>
    </>
  )
}