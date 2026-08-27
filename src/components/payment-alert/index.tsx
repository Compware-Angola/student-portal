import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Lottie from 'lottie-react'
import PaymentFailed from '@/assets/payment_failed.json'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import type { DebtNegotiationResponse } from '@/services/renegotiation/renegotiation.service'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryUsableAcademicYear } from '@/hooks/academic-year/use-query-usable-academic-year'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'

type PaymentAlertProps = {
  debit?: DebtNegotiationResponse
}

export function PaymentAlert({ debit }: PaymentAlertProps) {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  const { profileData } = useQueryProfile()
  const candidateType = profileData?.codigo_tipo_candidatura ?? 1

  const { data: academicYear } = useQueryUsableAcademicYear(candidateType)

  const { data: prazoConfirmacao } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: candidateType,
      tipo: TipoCalendario.CONFIRMACAO_MATRICULA,
      anoLectivo: academicYear?.codigo,
    },
    Boolean(academicYear?.codigo),
  )

  const emPrazoConfirmacao = prazoConfirmacao?.podeInscrever ?? false

  const hasPreviousYearDebt = (() => {
    if (!debit) return false
    const current = debit.anoAtual
    const mensalidadeAnterior = debit.Mensalidades?.some(
      (m) => m.ano_lectivo_fatura != null && m.ano_lectivo_fatura !== current,
    )
    const servicoAnterior = debit.OutrosServicos?.some(
      (s) => s.codigo_anolectivo != null && s.codigo_anolectivo !== current,
    )
    return mensalidadeAnterior || servicoAnterior
  })()

  const goFinance = () =>
    navigate(
      emPrazoConfirmacao && hasPreviousYearDebt ? '/renegociacao' : '/financas',
    )
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center flex-col">
            <Lottie
              animationData={PaymentFailed}
              loop={true}
              style={{ width: 300, height: 300 }}
            />
            <p className="text-xl">
              Caro estudante, a sua situação financeira está Irregular
            </p>
            <p className="text-xl">
              Para mais informações acessar a página financeira
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-12">
            <Button variant="secondary" onClick={goBack}>
              Voltar
            </Button>
            <Button onClick={goFinance}>página financeira</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
