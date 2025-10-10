'use client'

import * as React from 'react'
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
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
    name: 'Maria Maiamba Pascoal',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Metthodost University',
      logo: GalleryVerticalEnd,
      plan: 'Portal dos Estudantes',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: SquareTerminal,
      isActive: true,

    },
    {
      title: 'Finanças',
      url: '#',
      icon: Bot,

    },
    {
      title: 'Matrícula',
      url: '/matricula',
      icon: BookOpen,

    },
    {
      title: 'Pagamento Antecipado',
      url: '#',
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
