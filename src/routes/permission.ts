import { StudentStatus } from '@/enums/student.status.enum'
import type { StudentStatusType } from '@/enums/student.status.enum'

export const routePermissions: Record<StudentStatusType, string[]> = {
  [StudentStatus.MATRICULADO]: [
    '/',
    '/financas',
    '/horario',
    '/avaliacoes',
    '/avaliacoes/inscricoes-recurso',
    '/avaliacoes/inscricoes-especial',
    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',
    '/negociacao',
    '/calendario-academico',
    '/suporte',
    '/financas/notas-pagamento',
    '/perfil',
    '/inscricao-uc',
    '/pre-inscricao',
  ],
  [StudentStatus.DIPLOMADO]: [
    '/',
    '/financas',
    '/horario',
    '/avaliacoes',

    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',

    '/calendario-academico',
    '/suporte',
    '/financas/notas-pagamento',
    '/perfil',
    '/inscricao-uc',
    '/pre-inscricao',
  ],

  [StudentStatus.CANDIDATO]: ['/pre-inscricao'],

  [StudentStatus.PREINSCRITO]: [
    '/pre-dashboard',
    '/perfil',
    '/exame-acesso',
    '/pre-pagamento',
    '/pre-inscricao',
  ],
  [StudentStatus.PREINSCRITO_MESTRADO_POS_GRADUACAO]: [
    '/pre-dashboard',
    '/perfil',
    '/pre-pagamento',
    '/pre-inscricao',
  ],
  [StudentStatus.ADMITIDO_SEM_MATRICULA]: [
    '/',
    '/perfil',
    '/matricula',
    '/pre-inscricao',
  ],
  [StudentStatus.ADMITIDO_SEM_MATRICULA_MESTRADO_POS_GRADUACAO]: [
    '/',
    '/perfil',
    '/matricula-pos-graduacao',
    '/pre-inscricao',
  ],
  [StudentStatus.ALUNO_MATRICULADO_MESTRADO_POS_GRADUACAO]: [
    '/',
    '/matricula-pos-graduacao',
    '/financas',
    '/horario',
    '/avaliacoes',
    '/avaliacoes/inscricoes-recurso',
    '/avaliacoes/inscricoes-especial',
    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',
    '/negociacao',
    '/calendario-academico',
    '/suporte',
    '/financas/notas-pagamento',
    '/perfil',
    '/pre-inscricao',
  ],
}

const homeRouteByStatus: Record<StudentStatusType, string> = {
  [StudentStatus.MATRICULADO]: '/',
  [StudentStatus.CANDIDATO]: '/pre-inscricao',
  [StudentStatus.PREINSCRITO]: '/pre-dashboard',
  [StudentStatus.PREINSCRITO_MESTRADO_POS_GRADUACAO]: '/pre-dashboard',
}
export function getHomeRoute(status: StudentStatusType) {
  return homeRouteByStatus[status] ?? '/'
}
