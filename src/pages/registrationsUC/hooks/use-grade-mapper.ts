import { useTypeService } from "@/hooks/service/use-query-type-service"
import type { Grade } from "@/types/grade"


export function useGradeMapper() {
  const { data } = useTypeService({
    codigoAnoLectivo: 23,
    sigla: 'IpuCricular(Anual)',
  })

  const valorInscricao = data?.[0]?.preco?.toString() ?? '0'

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