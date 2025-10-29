'use client'

import * as React from 'react'
import {
  Calendar,
  ClipboardList,
  CreditCard,
  GraduationCap,
  HandCoins,
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
import { AuthStorage } from '@/storage/auth-storage'

const data = {
  navMain: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'Horário', url: '/horario', icon: Calendar },
    { title: 'Finanças', url: '/financa', icon: CreditCard },
    { title: 'Matrícula', url: '/matricula', icon: GraduationCap },
    { title: 'Pré-Inscrição', url: '/presubscription', icon: ClipboardList },
    {
      title: 'Pagamento Antecipado',
      url: '/pagamento-antecipado',
      icon: Wallet,
    },
    { title: 'Renegociação', url: '/renegociacao', icon: HandCoins },
    { title: 'Perfil', url: '/perfil', icon: User },
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
