import {
  getEnrollmentLabel,
  getEnrollmentRoute,
} from '@/utils/map-student-situation'
import { useStudentSituation } from './use-student-stitiation'
import {
  BookOpen,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HandCoins,
  HelpCircle,
  Home,
  LayoutDashboard,
  Library,
  MessageSquare,
  Pencil,
  Receipt,
  RotateCcw,
  Star,
  User,
} from 'lucide-react'

import { routePermissions } from '@/routes/permission'
import { useQueryProfile } from './profile/use-query-profile'

export function useMenuNavigation() {
  const {profileData} = useQueryProfile()
  const { hasEnrolmentCode, isLoading } = useStudentSituation()
  const { isLoading: isLoadingProfile, studentStatus } = useQueryProfile()

  if (isLoading || isLoadingProfile || !studentStatus || !profileData) {
    return { navMain: [] }
  }

  const enrollmentPath = getEnrollmentRoute(hasEnrolmentCode)
  const enrollmentTitle = getEnrollmentLabel(hasEnrolmentCode)

  const navMain = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },

    {
      title: 'Finanças',
      url: '/financas',
      icon: CreditCard,
      items: [
        {
          title: 'Histórico de Pagamento',
          url: '/financas/notas-pagamento',
          icon: Receipt,
        },
      ],
    },

    {
      title: enrollmentTitle,
      url: enrollmentPath,
      icon: GraduationCap,
    },

    { title: 'Horário', url: '/horario', icon: Calendar },
    {
      title: 'Avaliações',
      url: '/avaliacoes',
      icon: ClipboardList,
      items: [
        {
          title: 'Recurso',
          url: '/avaliacoes/inscricoes-recurso',
          icon: RotateCcw,
        },
        {
          title: 'Especial',
          url: '/avaliacoes/inscricoes-especial',
          icon: Star,
        },
      ],
    },
    {
      title: 'Serviços Acadêmicos',
      url: '/servicos-academicos',
      icon: BookOpen,
    },

    { title: 'Disciplinas', url: '/disciplinas', icon: Library },
    {
      title: 'Mensagens & Comunicados',
      url: '/mensagens',
      icon: MessageSquare,
    },
    {
      title: 'Calendário Acadêmico',
      url: '/calendario-academico',
      icon: ClipboardList,
    },
    { title: 'Suporte', url: '/suporte', icon: HelpCircle },
    {
      title: 'Negociação de Dívida',
      url: '/renegociacao',
      icon: HandCoins,
    },
    //ROTAS PARA CANDIDATOS
    {
      title: 'Inicio',
      url: '/pre-inscricao',
      icon: Home,
    },
    {
      title: 'Inicio',
      url: '/pre-dashboard',
      icon: Home,
    },
    { title: 'Exame de Acesso', url: '/exame-acesso', icon: Pencil },
    { title: 'Pagamento', url: '/pre-pagamento', icon: CircleDollarSign },
    { title: 'Perfil', url: '/perfil', icon: User },
  ]

  const allowedRoutes = routePermissions[studentStatus] || []

  const filteredNavMain = navMain
    .filter((item) => allowedRoutes.includes(item.url))
    .map((item) =>
      item.items
        ? {
            ...item,
            items: item.items.filter((sub) => allowedRoutes.includes(sub.url)),
          }
        : item,
    )

  return {
    navMain: filteredNavMain,
  }
}
