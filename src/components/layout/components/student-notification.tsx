import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryAvisosPorGrupo } from '@/hooks/use-query-aviso-por-grupos'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

function formatarExpiracao(data: string | null) {
  if (!data) return 'Sem expiração'

  return new Date(data).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function StudentNotifications() {
  const navigate = useNavigate()
  const { profileData } = useQueryProfile()

  const GRUPO_ESTUDANTE = 12

  const curso = profileData?.codigo_curso
    ? Number(profileData.codigo_curso)
    : undefined

  const periodo = profileData?.periodoId
    ? Number(profileData.periodoId)
    : undefined

  const { data: avisosGrupo = [] } = useQueryAvisosPorGrupo({
    grupoId: GRUPO_ESTUDANTE,
    curso,
    periodo,
  })

  const avisosValidos = useMemo(() => {
    const agora = new Date()

    return avisosGrupo.filter((aviso) => {
      const ativo = aviso.STATUS === 1

      const naoExpirado =
        !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora

      return ativo && naoExpirado
    })
  }, [avisosGrupo])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {avisosValidos.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
            >
              {avisosValidos.length > 99 ? '99+' : avisosValidos.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notificações
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator />

        {avisosValidos.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Sem notificações
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {avisosValidos.map((aviso) => (
              <DropdownMenuItem
                key={aviso.CODIGO}
                className="flex cursor-default flex-col items-start gap-1 px-3 py-2.5 focus:bg-accent"
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-tight text-foreground">
                    {aviso.ASSUNTO}
                  </span>

                  {aviso.DATE_EXPIRACAO && (
                    <span className="text-[10px] text-muted-foreground">
                      {formatarExpiracao(aviso.DATE_EXPIRACAO)}
                    </span>
                  )}
                </div>

                <span className="text-xs leading-snug text-muted-foreground line-clamp-2">
                  {aviso.DESCRICAO}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="justify-center text-xs text-primary cursor-pointer"
          onSelect={() => navigate('/notificacoes')}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}