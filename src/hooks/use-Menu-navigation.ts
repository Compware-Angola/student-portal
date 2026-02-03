import {
  getEnrollmentLabel,
  getEnrollmentRoute,
} from '@/utils/map-student-situation'
import { useStudentSituation } from './use-student-stitiation'
import {
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  HandCoins,
  HelpCircle,
  LayoutDashboard,
  Library,
  MessageSquare,
  Receipt,
  User,
} from 'lucide-react'

export function useMenuNavigation() {
  const { hasEnrolmentCode, isLoading } = useStudentSituation()

  if (isLoading) {
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
    { title: 'Avaliações', url: '/avaliacoes', icon: FileText },
    {
      title: 'Serviços Acadêmicos',
      url: '/servicos-academicos',
      icon: BookOpen,
    },
    { title: 'Perfil', url: '/perfil', icon: User },
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
  ]

  // 👉 URLs exclusivas para OLD
  const oldOnlyRoutes = [
    '/financas',
    '/horario',
    '/avaliacoes',
    '/servicos-academicos',
    '/disciplinas',
    '/mensagens',
    '/renegociacao',
    '/calendario-academico',
    '/suporte',
  ]

  const filteredNavMain = !hasEnrolmentCode
    ? navMain
        .filter((item) => !oldOnlyRoutes.includes(item.url))
        .map((item) =>
          item.items
            ? {
                ...item,
                items: item.items.filter(
                  (sub) => !oldOnlyRoutes.includes(sub.url),
                ),
              }
            : item,
        )
    : navMain

  return {
    navMain: filteredNavMain,
  }
}
