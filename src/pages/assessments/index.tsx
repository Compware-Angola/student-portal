import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect } from 'react'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { toast } from 'sonner'
import { CurriculumCard } from './curriculum-card'
// import { PaymentAlert } from '@/components/payment-alert'
// import { useQueryGetDebit } from '@/hooks/renegotiation/use-query-renegotiation'
import { Notes } from './notes'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowRight, Hourglass, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import NoResult from '@/assets/no_result.json'
import Lottie from 'lottie-react'

export function Assessments() {
  const { profileData, isError, isLoading } = useQueryProfile()
  const { estado_aluno, codigo_matricula, codigo_preinscricao } = profileData || {}
  const isDiplomado = estado_aluno === 'DIPLOMADO'
  const isConfirmacaoPendente =
    profileData?.confirmacoes?.length === 0 ||
    profileData?.confirmacoes[0]?.estado === 0
  const navigate = useNavigate()
  // const { data: debit, isLoading: isLoadingDebit } = useQueryGetDebit({
  //   type: '1',
  //   enrollmentCode: Number(codigo_matricula),
  //   preinscricao: Number(codigo_preinscricao),
  //   enabled: !!codigo_matricula && !!codigo_preinscricao && !isDiplomado
  // })

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching profile data:')
    }
  }, [isError])

  if (isLoading || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" className="opacity-10" />
            <circle
              cx="24" cy="24" r="20"
              stroke="currentColor" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 94.2"
              className="animate-spin origin-center"
              style={{ animationDuration: '0.85s' }}
            />
          </svg>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">A carregar</p>
          <p className="text-xs text-muted-foreground">Por favor aguarde...</p>
        </div>
      </div>
    )
  }

  // if (debit && (debit?.totalDivida ?? 0) > 0) return <PaymentAlert />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Consulte suas notas e acompanhe seu desempenho acadêmico
        </p>
      </div>

      {isConfirmacaoPendente && !isDiplomado && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
                    <Hourglass className="h-3 w-3" />
                    Inscrição por confirmar
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Estado: <strong className="text-foreground">Pendente</strong>
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-snug">
                  A sua inscrição ainda não foi confirmada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para activar o seu acesso completo (horários, avaliações e disciplinas), é necessário concluir os seguintes passos:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 pl-1">
                  <li>Efectuar o pagamento da taxa de inscrição.</li>
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => navigate('/financas')} className="gap-1.5">
                    <Wallet className="h-4 w-4" />
                    Regularizar pagamento
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/suporte')} className="gap-1.5">
                    Contactar Suporte
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Avaliações do Ano Corrente</TabsTrigger>
          <TabsTrigger value="all">Todas as Notas Finais</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {isConfirmacaoPendente && !isDiplomado ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-4">
              <div className="flex items-center flex-col">
                <Lottie
                  animationData={NoResult}
                  loop={true}
                  style={{ width: 150, height: 150 }}
                />
                <p className="text-sm">
                  As suas avaliações estarão disponíveis após a confirmação da inscrição.
                </p>
              </div>
            </div>
          ) : (
            <Notes codigoMatricula={codigo_matricula!} />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {isConfirmacaoPendente && !isDiplomado ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-4">
              {/* ESPAÇO PARA ANIMAÇÃO */}
              <div className="flex items-center flex-col">
                <Lottie
                  animationData={NoResult}
                  loop={true}
                  style={{ width: 150, height: 150 }}
                />
                <p className="text-sm">
                  O currículo estará disponível após a confirmação da inscrição.
                </p>
              </div>

            </div>
          ) : (
            <CurriculumCard
              preEnrollmentCode={codigo_preinscricao?.toString()!}
              enrollmentCode={codigo_matricula?.toString()!}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}