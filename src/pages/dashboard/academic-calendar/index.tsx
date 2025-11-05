import { useState, useEffect, useMemo } from 'react'
import { parseISO, isBefore, isAfter, isWithinInterval, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  GraduationCap,
  Filter,
  ArrowLeft,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryAcademicActivity } from '@/hooks/academic/use-query-academic-activity'
import { toast } from 'sonner'

type StatusAtividade = 'agendada' | 'em curso' | 'encerrada' | 'todas'

export function AcademicCalendar() {
  const navigate = useNavigate()
  const [statusFiltro, setStatusFiltro] = useState<StatusAtividade>('todas')

  const statusConfig = {
    'agendada': {
      label: 'Agendada',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    'em curso': {
      label: 'Em Curso',
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    'encerrada': {
      label: 'Encerrada',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  }
  const {
    isLoading: isProfileLoading,
    isError: isProfileError,
    profileData,
  } = useQueryProfile()

  const {
    data: atividades,
    isLoading: isAtividadesLoading,
    error: atividadesError,
  } = useQueryAcademicActivity({
    academicYear: profileData?.confirmacoes[0].ano_lectivo,
    applicationType: profileData?.codigo_tipo_candidatura,
  })

  useEffect(() => {
    if (isProfileError) {
      toast.error('Erro ao carregar dados do perfil')
    }
    if (atividadesError) {
      toast.error('Erro ao carregar Calendário Acadêmico')
    }
  }, [isProfileError, atividadesError])

  const getStatus = (dataInicio: string, dataTermino: string) => {
    const hoje = new Date()
    const inicio = parseISO(dataInicio)
    const termino = parseISO(dataTermino)

    if (isBefore(hoje, inicio)) return statusConfig.agendada
    if (isWithinInterval(hoje, { start: inicio, end: termino }))
      return statusConfig['em curso']
    if (isAfter(hoje, termino)) return statusConfig.encerrada

    return statusConfig.encerrada
  }

  // 🧮 Calcula e filtra as atividades com base no status
  const atividadesFiltradas = useMemo(() => {
    return atividades
      .map((a) => ({ ...a, status: getStatus(a.data_inicio, a.data_termino) }))
      .filter(
        (a) =>
          statusFiltro === 'todas' ||
          a.status.label.toLowerCase() === statusFiltro,
      )
      .sort(
        (a, b) =>
          parseISO(a.data_inicio).getTime() - parseISO(b.data_inicio).getTime(),
      )
  }, [atividades, statusFiltro])

  // 📊 Contadores por tipo
  const contadores = useMemo(() => {
    return atividades.reduce((acc: Record<string, number>, a) => {
      const s = getStatus(a.data_inicio, a.data_termino).label.toLowerCase()
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})
  }, [atividades])

  // 📆 Formatar data com locale pt-BR
  const formatarData = (data: string) =>
    format(parseISO(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  if (isProfileLoading || isAtividadesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Clock className="h-6 w-6 animate-spin mb-2" />
        Carregando calendário acadêmico...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(-1)}
        className="h-10 w-10"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Calendário Acadêmico
          </h1>
        </div>

        {statusFiltro !== 'todas' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusFiltro('todas')}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Limpar filtro
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="grid gap-6 md:grid-cols-3">
        <FiltroCard
          titulo="Agendadas"
          icone={<Clock className="h-4 w-4 text-blue-500" />}
          contador={contadores.agendada}
          ativo={statusFiltro === 'agendada'}
          cor="ring-blue-500"
          onClick={() => setStatusFiltro('agendada')}
        />
        <FiltroCard
          titulo="Em Curso"
          icone={<GraduationCap className="h-4 w-4 text-green-500" />}
          contador={contadores['em curso']}
          ativo={statusFiltro === 'em curso'}
          cor="ring-green-500"
          onClick={() => setStatusFiltro('em curso')}
        />
        <FiltroCard
          titulo="Encerradas"
          icone={<Calendar className="h-4 w-4 text-muted-foreground" />}
          contador={contadores.encerrada}
          ativo={statusFiltro === 'encerrada'}
          cor="ring-gray-400"
          onClick={() => setStatusFiltro('encerrada')}
        />
      </div>

      {/* Lista de atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {atividadesFiltradas.map((a) => (
          <Card key={a.codigo} className="hover:bg-muted transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{a.descricao}</CardTitle>
                  <CardDescription>{a.tipo_calendario}</CardDescription>
                </div>
                <Badge className={`${a.status.color} border shrink-0`}>
                  {a.status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <InfoLinha
                  icone={<Calendar className="h-4 w-4 mr-2" />}
                  label="Início"
                  valor={formatarData(a.data_inicio)}
                />
                <InfoLinha
                  icone={<Clock className="h-4 w-4 mr-2" />}
                  label="Término"
                  valor={formatarData(a.data_termino)}
                />
                <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Código: {a.codigo}</span>
                  <Badge variant="outline">{a.tipo_candidatura}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {atividadesFiltradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhuma atividade encontrada para este filtro.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/* === Subcomponentes auxiliares === */
function FiltroCard({ titulo, icone, contador = 0, ativo, cor, onClick }: any) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:bg-muted ${
        ativo ? `ring-2 ${cor}` : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        {icone}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{contador}</div>
      </CardContent>
    </Card>
  )
}

export function InfoLinha({
  icone,
  label,
  valor,
}: {
  icone: React.ReactNode
  label: string
  valor: string
}) {
  return (
    <div className="flex items-center text-sm">
      {icone}
      <span className="font-medium mr-2">{label}:</span>
      <span className="text-muted-foreground">{valor}</span>
    </div>
  )
}
