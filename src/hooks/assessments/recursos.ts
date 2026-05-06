import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCadeirasRecurso,
  type InscricaoRecursoPayload,
  inscreverRecurso,
  getCadeirasRecursoInscritas,
  getCadeirasEspecial,
  getCadeirasEpocaEspecialInscritas,
  inscreverEpocaEspecial,
  type InscricaoEpocaEspecialPayload,
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
      getCadeirasRecurso({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    enabled: !!anoLetivo && !!matricula,
  })
}

export const useMutateInscricaoRecuro = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (dados: InscricaoRecursoPayload) => inscreverRecurso(dados),
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

export function useQueryCadeirasEpocaEspecial({ anoLetivo, matricula }: Props) {
  return useQuery({
    queryKey: ['cadeiras-epoca-especial', anoLetivo, matricula],
    queryFn: () =>
      getCadeirasEspecial({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    enabled: !!anoLetivo && !!matricula,
  })
}

export function useQueryCadeirasEpocaEspecialInscritas({
  anoLetivo,
  matricula,
}: Props) {
  return useQuery({
    queryKey: ['cadeiras-epoca-especial-inscritas', anoLetivo, matricula],
    queryFn: () =>
      getCadeirasEpocaEspecialInscritas({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    enabled: !!anoLetivo && !!matricula,
  })
}

export const useMutateInscricaoEpocaEspecial = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (dados: InscricaoEpocaEspecialPayload) =>
      inscreverEpocaEspecial(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadeiras-epoca-especial'] })
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
