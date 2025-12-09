import {
  getEnrollmentLabel,
  getEnrollmentRoute,
} from '@/utils/map-student-situation'
import { useStudentSituation } from './use-student-stitiation'
import {
  BookOpen,
  Calendar,
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
  const { studentType, isLoading } = useStudentSituation()

  if (isLoading || !studentType) {
    return { navMain: [] }
  }

  const enrollmentPath = getEnrollmentRoute(studentType)
  const enrollmentTitle = getEnrollmentLabel(studentType)

  return {
    navMain: [
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
      { title: 'Suporte', url: '/suporte', icon: HelpCircle },
      {
        title: 'Negociação de Dívida',
        url: '/renegociacao',
        icon: HandCoins,
      },
    ],
  }
}
