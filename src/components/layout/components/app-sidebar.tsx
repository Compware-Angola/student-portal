'use client'

import * as React from 'react'
import {
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  User,
  Wallet,
} from 'lucide-react'

import { NavMain } from '@/components/layout/components/nav-main'
import { NavUser } from '@/components/layout/components/nav-user'
import { TeamSwitcher } from '@/components/layout/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: 'Domingos Canhnaga',
    email: 'canhanga96@gmail.cpm',
    avatar: '/avatars/shadcn.jpg',
  },

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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
