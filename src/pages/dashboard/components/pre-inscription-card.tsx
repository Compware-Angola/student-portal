import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Download,
  Sparkles,
  GraduationCap as GradCap,
  ScrollText,
  BookMarked,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaymentDialog } from '@/pages/pre-payment/components/payment-dialog'
import { handleDownload as handleDownloadFicha } from '@/components/uma-ficha-inscricao'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryPreInscricaoFicha } from '@/hooks/pre-registation/use-query-pre-registration'
import { useQueryInfoGeraisCandidatura } from '@/hooks/pre-registation/use-query-info-gerais-candidatura'
import { StudentStatus } from '@/enums/student.status.enum'
const MESSAGES = {
  [StudentStatus.PREINSCRITO_MESTRADO_POS_GRADUACAO]: {
    badge: 'Pós-graduação',
    title: 'Pré-inscrição realizada com sucesso',
    description:
      'O próximo passo é efetuar o pagamento da taxa de inscrição. Após a confirmação do pagamento, os seus documentos serão analisados pela equipa académica.',
  },

  [StudentStatus.PREINSCRITO]: {
    badge: 'Pré-inscrição confirmada',
    title: 'Prepare-se para o exame de admissão',
    description:
      'Os materiais de apoio para o exame de admissão já estão disponíveis. Faça o download e inicie a sua preparação.',
  },
} as const
const PreInscriptionCard = () => {
  const { profileData } = useQueryProfile()
  const { data } = useQueryPreInscricaoFicha(profileData?.user_id!)
  const {
    data: info,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
  } = useQueryInfoGeraisCandidatura()
  console.log(data)
  const showModal = () =>
    !isLoadingInfo && !isErrorInfo && !info?.payments?.has_invoice

  const documentosPreInscricao = [
    {
      id: 1,
      title: 'Ficha de Inscrição',
      description: 'Documento com os dados da sua candidatura',
      icon: BookMarked,
      file: 'ficha-inscricao.pdf',
      tag: 'Essencial',
      action: () => handleDownloadFicha(data),
    },
    /*
    {
      id: 2,
      title: 'Manual de Pagamentos',
      description: 'Guia completo sobre como efectuar os pagamentos.',
      icon: Wallet,
      file: 'manual-pagamentos.pdf',
      tag: 'Financeiro',

    },
    */
    {
      id: 3,
      title: 'Regulamento dos Exames',
      description: 'Normas e procedimentos para o exame de admissão.',
      icon: ScrollText,
      file: 'regulamento-exames.pdf',
      tag: 'Regras',
      action: () => {
        const link = document.createElement('a')
        link.href = '/docs/regulamento-exames.pdf'
        link.download = 'regulamento-exames.pdf'
        link.click()
      },
    },
    {
      id: 4,
      title: 'Regulamento Académico',
      description: 'Regulamento geral da vida académica.',
      icon: FileText,
      file: 'regulamento-academico.pdf',
      tag: 'Oficial',
      action: () => {
        const link = document.createElement('a')
        link.href = '/docs/regulamento-academico.pdf'
        link.download = 'regulamento-academico.pdf'
        link.click()
      },
    },
    /*
 {
   id: 5,
   title: 'Guia do Candidato',
   description: 'Informações essenciais para novos candidatos.',
   icon: Info,
   file: 'guia-candidato.pdf',
   tag: 'Recomendado',
 },
 
 {
   id: 6,
   title: 'Calendário do Exame',
   description: 'Datas, horários e locais do exame de admissão.',
   icon: CalendarDays,
   file: 'calendario-exame.pdf',
   tag: 'Importante',
 },
 */
  ]

  return (
    <>
      {/* HERO - sóbrio e profissional */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
            <GradCap className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {
                  MESSAGES[
                    profileData?.estado_aluno ?? StudentStatus.PREINSCRITO
                  ].badge
                }
              </Badge>
            </div>
            <h2 className="text-xl font-semibold mb-1">
              {
                MESSAGES[profileData?.estado_aluno ?? StudentStatus.PREINSCRITO]
                  .title
              }
            </h2>
            <p className="text-sm text-muted-foreground">
              {
                MESSAGES[profileData?.estado_aluno ?? StudentStatus.PREINSCRITO]
                  .description
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* DOCS GRID */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Documentos Importantes
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Materiais oficiais para preparar o seu exame de admissão.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentosPreInscricao.map((doc) => {
            return <DocumentCard doc={doc} />
          })}
        </div>
      </div>
      <PaymentDialog isOpen={showModal()} />
    </>
  )
}

type DocumentCardProps = {
  doc: {
    id: number
    title: string
    description: string
    tag: string
    file: string
    icon: any
    action?: () => void
  }
}

export function DocumentCard({ doc }: DocumentCardProps) {
  const Icon = doc.icon
  return (
    <Card className="group hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="p-2.5 rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wide"
          >
            {doc.tag}
          </Badge>
        </div>

        <CardTitle className="text-base mt-3 leading-snug">
          {doc.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {doc.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>PDF</span>
          </div>

          <Button
            onClick={doc.action}
            size="sm"
            variant="outline"
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { PreInscriptionCard }
