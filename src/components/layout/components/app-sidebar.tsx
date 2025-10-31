'use client'

import * as React from 'react'
import {
  BookOpen,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
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
    { title: 'Finanças', url: '/financas', icon: CreditCard },
    { title: 'Matrícula', url: '/matricula', icon: GraduationCap },
    { title: 'Horário', url: '/horario', icon: Calendar },
    { title: 'Avaliações', url: '/avaliacoes', icon: FileText },
    {
      title: 'Serviços Acadêmicos',
      url: '/servicos-academicos',
      icon: BookOpen,
    },
    { title: 'Pré-Inscrição', url: '/pre-inscricao', icon: ClipboardList },
    { title: 'Perfil', url: '/perfil', icon: User },
    {
      title: 'Pagamento Antecipado',
      url: '/pagamento-antecipado',
      icon: Wallet,
    },
    { title: 'Renegociação', url: '/renegociacao', icon: HandCoins },
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
