import { useTypeService } from "@/hooks/service/use-query-type-service"
import type { Grade } from "@/types/grade"

import { SERVICE_TYPES } from '@/constants/service-type'
export function useGradeMapper(academicYearCode?: number) {

  const { data } = useTypeService({
    codigoAnoLectivo: academicYearCode,
    sigla: SERVICE_TYPES.IPU_CICLULAR_SEMESTRAL.sigla,
  }, Boolean(academicYearCode))

  const valorInscricao = data?.[0]?.preco?.toString() ?? '0'
  const codigoProduto = data?.[0]?.codigo?.toString() ?? ''

  function mapGrade(apiGrade: any): Grade {
    return {
      classe: apiGrade.classe,
      codigoDisciplina: apiGrade.codigo_disciplina.toString(),
      codigoGrade: apiGrade.codigo.toString(),
      disciplina: apiGrade.disciplina,
      duracaoDisciplina: apiGrade.duracao,
      semestre: apiGrade.semestre,
      semestreId: getSemestreId(apiGrade.semestre),
      valorInscricao,
      codigoProduto,
    }
  }

  function mapGrades(apiGrades: any[]): Grade[] {
    return apiGrades.map(mapGrade)
  }

  return {
    mapGrade,
    mapGrades,
  }
}

function getSemestreId(semestre: string): number {
  if (semestre.includes('I')) return 1
  if (semestre.includes('II')) return 2

  return 0
}