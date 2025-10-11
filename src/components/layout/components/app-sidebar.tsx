'use client'

import * as React from 'react'
import {
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Wallet,
} from 'lucide-react'

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
import { logout } from '@/services/auth.service'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Finanças',
      url: '/financa',
      icon: Wallet,
    },
    {
      title: 'Matrícula',
      url: '/matricula',
      icon: GraduationCap, // 🎓 representa educação e matrícula
    },
    {
      title: 'Pagamento Antecipado',
      url: '/pagamento-antecipado',
      icon: CreditCard, // 💳 pagamento direto, fácil associação
    },
    {
      title: 'Perfil',
      url: '/perfil',
      icon: User, // 👤 clássico para perfil do usuário
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          onClick={logout}
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
