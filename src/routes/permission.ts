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
    '/perfil',
  ],

  [StudentStatus.CANDIDATO]: ['/pre-inscricao'],
  [StudentStatus.APROVADO]: ['/pre-dashboard', '/perfil'],
  [StudentStatus.REPROVADO]: ['/pre-dashboard', '/perfil'],
  [StudentStatus.SEM_ADMISSAO]: ['/pre-dashboard', '/perfil'],
  [StudentStatus.AGUARDANDO_RESULTADO]: ['/pre-dashboard', '/perfil'],
}

const homeRouteByStatus: Record<StudentStatusType, string> = {
  [StudentStatus.MATRICULADO]: '/',
  [StudentStatus.CANDIDATO]: '/pre-inscricao',
  [StudentStatus.APROVADO]: '/pre-dashboard',
  [StudentStatus.REPROVADO]: '/pre-dashboard',
  [StudentStatus.SEM_ADMISSAO]: '/pre-dashboard',
  [StudentStatus.AGUARDANDO_RESULTADO]: '/pre-dashboard',
}

export function getHomeRoute(status: StudentStatusType) {
  return homeRouteByStatus[status] ?? '/'
}
