import { StudentStatus } from '@/enums/student.status.enum'
import type { StudentStatusType } from '@/enums/student.status.enum'

export const routePermissions: Record<StudentStatusType, string[]> = {
  [StudentStatus.MATRICULADO]: [
    '/',
    '/financas',
    '/horario',
    '/avaliacoes',
    '/avaliacoes/inscricoes-recurso',
    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',
    '/renegociacao',
    '/calendario-academico',
    '/suporte',
    '/financas/notas-pagamento',
    '/perfil',
    '/inscricao-uc'
  ],

  [StudentStatus.CANDIDATO]: ['/pre-inscricao'],

  [StudentStatus.PREINSCRITO]: [
    '/pre-dashboard',
    '/perfil',
    '/exame-acesso',
    '/pre-pagamento'
  ],
   [StudentStatus.ADMITIDO_SEM_MATRICULA]: [
    '/',
    '/perfil',
    '/matricula',
  ],
}

const homeRouteByStatus: Record<StudentStatusType, string> = {
  [StudentStatus.MATRICULADO]: '/',
  [StudentStatus.CANDIDATO]: '/pre-inscricao',
  [StudentStatus.PREINSCRITO]: '/pre-dashboard',
}
export function getHomeRoute(status: StudentStatusType) {
  return homeRouteByStatus[status] ?? '/'
}
