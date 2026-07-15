//import { useFormPreSubscriptionForm } from './form-provider'
import { Button } from '@/components/ui/button'
import EnrollmentSheet from '@/components/uma-ficha-inscricao'
import { useQueryPreInscricaoFicha } from '@/hooks/pre-registation/use-query-pre-registration'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { fmt } from '@/utils/fmt'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, GraduationCap, PartyPopper } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ResumeDetails() {
  const { profileData } = useQueryProfile()
  const { data } = useQueryPreInscricaoFicha(profileData?.user_id!)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  async function handleGoToPayments() {
    await queryClient.invalidateQueries({ queryKey: ['profile'] })
    navigate('/pre-inscricao')
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-9 w-9 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold flex items-center gap-2 justify-center">
          Dados submetidos com sucesso!
          <PartyPopper className="h-6 w-6 text-primary" />
        </h2>

        <p className="text-sm text-muted-foreground max-w-md">
          A sua pré-inscrição foi registada com sucesso.{' '}
          <span className=" font-semibold text-destructive">
            Para que a sua candidatura seja validada e a admissão confirmada,
            deverá proceder ao pagamento da taxa de admissão.
          </span>
        </p>
      </div>
      {/* Info box (substitui Card) */}
      <div className="w-full max-w-md rounded-lg border bg-muted/40 p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Candidato</span>
          <span className="font-medium">
            {fmt(data?.dados_pessoais?.nome_completo)}
          </span>
        </div>

        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Curso</span>
          <span className="font-medium">
            {fmt(data?.opcoes_curso[0]?.designacao)}
          </span>
        </div>

        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">
            {fmt(data?.dados_pessoais?.email)}
          </span>
        </div>
      </div>
      <div className="flex space-x-1">
        <EnrollmentSheet data={data} showDownloadButton={true} />
        <Button
          type="button"
          onClick={() => handleGoToPayments()}
          className="flex-1"
          variant="outline"
          aria-label="Descarregar PDF"
        >
          <GraduationCap className="mr-2 h-4 w-4" />
          Ir para Dashboard
        </Button>
      </div>

      {/* Button */}

      <p className="text-xs text-muted-foreground text-center max-w-md">
        Guarde a ficha de inscrição. Ela poderá ser exigida no dia do exame.
      </p>
    </div>
  )
}
