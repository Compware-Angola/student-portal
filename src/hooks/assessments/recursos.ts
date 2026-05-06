import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCadeirasRecuros,
  getCadeirasRecursoInscritas,
  incricaoRecuro,
  type IncricaoRecuro,
} from '@/services/assessments/recursos.service'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
type Props = {
  anoLetivo?: number
  matricula?: number
  semestre?: number
}
export function useQueryCadeirasRecuros({ anoLetivo, matricula }: Props) {
  return useQuery({
    queryKey: ['cadeiras-recursos', anoLetivo, matricula],
    queryFn: () =>
      getCadeirasRecuros({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
        semestre: 1,
      }),
    enabled: !!anoLetivo && !!matricula,
  })
}

export const useMutateInscricaoRecuro = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (dados: IncricaoRecuro) => incricaoRecuro(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadeiras-recursos'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Inscrição realizada com sucesso')
      const payload = {
        tab: 'nota-pagamento',
        from: 'servicos',
        ts: Date.now(),
      }
      const encoded = btoa(JSON.stringify(payload))
      navigate(`/financas?data=${encoded}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useQueryCadeirasRecursoInscritas({
  anoLetivo,
  matricula,
}: Props) {
  return useQuery({
    queryKey: ['cadeiras-recursos-inscritas', anoLetivo, matricula],
    queryFn: () =>
      getCadeirasRecursoInscritas({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    enabled: !!anoLetivo && !!matricula,
  })
}
