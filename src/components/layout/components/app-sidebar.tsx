'use client'

import * as React from 'react'
import { LogOut } from 'lucide-react'

import { NavMain } from '@/components/layout/components/nav-main'
import { TeamSwitcher } from '@/components/layout/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AuthStorage } from '@/storage/auth-storage'

<<<<<<< HEAD
import { useMenuNavigation } from '@/hooks/use-Menu-navigation'
=======
const data = {
  navMain: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Finanças', url: '/financas', icon: CreditCard ,items: [{ title: 'Histórico de Pagamento', url: '/notas-pagamento', icon: Receipt }]},
  
    { title: 'Matrícula', url: '/matricula', icon: GraduationCap },
    { title: 'Horário', url: '/horario', icon: Calendar },
    { title: 'Avaliações', url: '/avaliacoes', icon: FileText },
    {
      title: 'Serviços Acadêmicos',
      url: '/servicos-academicos',
      icon: BookOpen,
    },
  //  { title: 'Pré-Inscrição', url: '/pre-inscricao', icon: ClipboardList },
    { title: 'Perfil', url: '/perfil', icon: User },
  
    /* {
      title: 'Pagamento Antecipado',
      url: '/pagamento-antecipado',
      icon: Wallet,
    }, */
    { title: 'Disciplinas', url: '/disciplinas', icon: Library },

    { title: 'Mensagens & Comunicados', url: '/mensagens', icon: MessageSquare },
    { title: 'Suporte', url: '/suporte', icon: HelpCircle },

  

    { title: 'Negociação de Dívida', url: '/renegociacao', icon: HandCoins },
  ],
}
>>>>>>> 518e916dbbba493709eb03ac923d2e0b5df3a5e3

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useMenuNavigation()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          onClick={() => {
            AuthStorage.clear()
            window.location.reload()
          }}
          aria-label="Terminar Sessão"
          tooltip="Terminar Sessão"
          className="hover:bg-destructive bg-destructive"
        >
          <LogOut />
          <span>Terminar Sessão</span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
