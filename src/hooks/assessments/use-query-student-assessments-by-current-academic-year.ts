import {
  getStudentAssessmentsByCurrentAcademicYear,
  type StudentAssessmentResponse,
} from '@/services/assessments/student-assessments-by-current-academic-year.service'
import { useQuery } from '@tanstack/react-query'

type Params = {
  classe?: string
  anoLetivo?: string
  matricula?: string
  semestre?: string
}

/**
 * Hook React Query para listar as avaliações do aluno.
 * Refresca automaticamente a cada 10 minutos.
 */
export function useQueryStudentAssessmentsByCurrentAcademicYear(
  params?: Params,
) {
  const queryKey = [
    'student-assessments',
    params?.classe,
    params?.anoLetivo,
    params?.matricula,
    params?.semestre
  ]

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<StudentAssessmentResponse>({
      queryKey,
      queryFn: async () => {
        if (!params?.classe || !params?.anoLetivo || !params?.matricula) {
          throw new Error('Classe, ano letivo e matrícula são obrigatórios')
        }

        return getStudentAssessmentsByCurrentAcademicYear({
          classe: params.classe,
          anoLetivo: params.anoLetivo,
          matricula: params.matricula,
          semestre: params.semestre
        })
      },
      enabled: Boolean(
        params?.classe && params?.anoLetivo && params?.matricula,
      ),
      staleTime: 1000 * 60 * 10, // 10 minutos
      refetchInterval: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    })

  return {
    data: data?.avaliacoes ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
