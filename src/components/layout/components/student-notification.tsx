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
import { useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function StudentNotifications() {
  const navigate = useNavigate()
  const { profileData } = useQueryProfile()

  const seenAvisoIds = useRef<Set<number>>(new Set())
  const isFirstLoad = useRef(true)

  const GRUPO_ESTUDANTE_SIGLA = 'EST'

  const curso = profileData?.codigo_curso
    ? Number(profileData.codigo_curso)
    : undefined

  const periodo = profileData?.periodoId
    ? Number(profileData.periodoId)
    : undefined

  const { data: avisosGrupo = [] } = useQueryAvisosPorGrupo({
    sigla: GRUPO_ESTUDANTE_SIGLA,
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

  useEffect(() => {
    if (avisosValidos.length === 0) return

    const novos = avisosValidos.filter(
      (aviso) => !seenAvisoIds.current.has(aviso.CODIGO)
    )

    if (isFirstLoad.current) {
      avisosValidos.forEach((aviso) => seenAvisoIds.current.add(aviso.CODIGO))
      isFirstLoad.current = false
      return
    }

    if (novos.length === 0) return

    novos.forEach((aviso) => seenAvisoIds.current.add(aviso.CODIGO))

    if (novos.length <= 3) {
      toast.success('🔔 Recebeste um novo aviso', {
        position: 'top-right',
      })
    } else {
      toast.success(`🔔 Recebeste ${novos.length} novos avisos`, {
        position: 'top-right',
      })
    }
  }, [avisosValidos])

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
            {avisosValidos.map((aviso, index) => (
              <div key={aviso.CODIGO}>
                <DropdownMenuItem
                  className="cursor-default px-3 py-3 focus:bg-muted/50 data-[highlighted]:bg-muted/50"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="line-clamp-2 text-xs leading-6 text-foreground">
                      {aviso.DESCRICAO}
                    </span>
                  </div>
                </DropdownMenuItem>

                {index < avisosValidos.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="justify-center text-xs text-primary cursor-pointer"
          onSelect={() => navigate('/mensagens')}
        >
          Ver todas as notificações
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}