import { AppSidebar } from './components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ModeToggle } from '../mode-toggle'
import { StudentInfo } from './components/student-info'
import { StudentNotifications } from './components/student-notification'

// Mapeia o "slug" da rota para um label amigável.
// Se a rota não estiver aqui, o label é gerado automaticamente a partir do path.
const breadcrumbLabels: Record<string, string> = {
  disciplinas: 'Disciplinas',
  notas: 'Notas',
  frequencia: 'Frequência',
  financeiro: 'Financeiro',
  perfil: 'Perfil',
  configuracoes: 'Configurações',
}

function formatLabel(segment: string) {
  // Fallback: transforma "minha-rota" em "Minha rota"
  const withSpaces = segment.replace(/-/g, ' ')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

function useBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  let path = ''
  return segments.map((segment) => {
    path += `/${segment}`
    return {
      label: breadcrumbLabels[segment] ?? formatLabel(segment),
      href: path,
    }
  })
}

export default function Layout() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 sticky top-0 bg-background z-50 border-border border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-between flex-1 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to="/">Portal do Aluno</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    return (
                      <div key={crumb.href} className="flex items-center gap-2">
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-10 items-center">
              <StudentNotifications />
              <StudentInfo />
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 py-10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}