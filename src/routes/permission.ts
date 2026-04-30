import { StudentStatus } from '@/enums/student.status.enum'
import type { StudentStatusType } from '@/enums/student.status.enum'

export const routePermissions: Record<StudentStatusType, string[]> = {
  [StudentStatus.MATRICULADO]: [
    '/',
    '/financas',
    '/horario',
    '/avaliacoes',
    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',
    '/renegociacao',
    '/calendario-academico',
    '/suporte',
    '/financas/notas-pagamento',
  ],

  [StudentStatus.CANDIDATO]: ['/pre-inscricao'],

  [StudentStatus.APROVADO]: ['/pre-inscricao'],

  [StudentStatus.REPROVADO]: ['/pre-inscricao'],
}

const homeRouteByStatus: Record<StudentStatusType, string> = {
  [StudentStatus.MATRICULADO]: '/',
  [StudentStatus.CANDIDATO]: '/pre-inscricao',
  [StudentStatus.APROVADO]: '/pre-inscricao',
  [StudentStatus.REPROVADO]: '/pre-inscricao',
}

export function getHomeRoute(status: StudentStatusType) {
  return homeRouteByStatus[status] ?? '/'
}