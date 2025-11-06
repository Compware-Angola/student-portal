'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useQueryStudentSchedule } from '@/hooks/schedule/use-query-student-schedule'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Calendar } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
type DiaSemana =
  | 'Segunda-Feira'
  | 'Terça-Feira'
  | 'Quarta-Feira'
  | 'Quinta-Feira'
  | 'Sexta-Feira'
  | 'Sábado'

type AulaHorario = {
  hora_inicio: string
  hora_termino: string
  disciplina: string
  sala: string
  tipo: string
}
const obterDiaAtual = () => {
  const dias = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado',
  ]
  return dias[new Date().getDay()]
}

export function Schedule() {
  const [diaSelecionado, setDiaSelecionado] = useState(obterDiaAtual())

  const {
    error: errorProfile,
    isError: isErrorProfile,
    isLoading: isLoadingProfile,
    profileData,
  } = useQueryProfile()

  const academicYear = profileData?.confirmacoes[0]?.ano_lectivo
  const preEnrollmentCode = profileData?.preEnrollmentCode

  const {
    data: scheduleData,
    error: errorSchedule,
    isError: isErrorSchedule,
    isLoading: isLoadingSchedule,
  } = useQueryStudentSchedule({
    academicYear,
    preEnrollmentCode,
  })
  // ✅ NOVA CONDIÇÃO: Confirmação não validada
if (!isLoadingProfile && (!profileData?.confirmacoes || profileData.confirmacoes.length === 0)) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Meu Horário</h1>
      
      <Card className="border-red-200 bg-red-50/50 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          
          {/* ÍCONE ANIMADO CENTRALIZADO */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75 w-24 h-24 mx-auto" />
            <div className="relative animate-bounce-slow">
              <AlertCircle className="h-20 w-20 text-red-600 drop-shadow-lg" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-red-900 mb-2">
            Confirmação Pendente
          </h3>
          
          <p className="text-red-700 max-w-md leading-relaxed">
            A sua confirmação <strong>não está validada pelo setor das finanças</strong>.<br />
            Por favor, dirija-se à <strong>secretaria</strong> para regularizar a situação e acessar o seu horário.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
  const organizarPorDia = (): Record<DiaSemana, AulaHorario[]> => {
    const diasSemana: Record<DiaSemana, AulaHorario[]> = {
      'Segunda-Feira': [],
      'Terça-Feira': [],
      'Quarta-Feira': [],
      'Quinta-Feira': [],
      'Sexta-Feira': [],
      'Sábado': [],
    }

    if (!scheduleData?.length) return diasSemana

    scheduleData.forEach((disciplina) => {
      disciplina.detalhes_aulas.forEach((aula) => {
        const dia = aula.designacao as DiaSemana
        if (dia in diasSemana) {
          diasSemana[dia].push({
            hora_inicio: aula.hora_inicio,
            hora_termino: aula.hora_termino,
            disciplina: disciplina.nome_disciplina,
            sala: aula.sala,
            tipo: aula.tipo,
          })
        }
      })
    })

    Object.values(diasSemana).forEach((aulas) =>
      aulas.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
    )

    return diasSemana
  }
  const schedule = useMemo(() => organizarPorDia(), [scheduleData])

  const diasDisponiveis = useMemo(
    () => ['Todos', ...Object.keys(schedule)],
    [schedule],
  )

  const diasParaMostrar = useMemo(() => {
    return diaSelecionado === 'Todos'
      ? Object.entries(schedule)
      : Object.entries(schedule).filter(([dia]) => dia === diaSelecionado)
  }, [diaSelecionado, schedule])

  const temAulas = useMemo(() => {
    return diasParaMostrar.some(([, aulas]) => aulas.length > 0)
  }, [diasParaMostrar])

  // ✅ AGORA OS RETURNS CONDICIONAIS
  if (isLoadingProfile || isLoadingSchedule) {
    return <ScheduleSkeleton />
  }

  if (isErrorProfile || isErrorSchedule) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar horário</AlertTitle>
          <AlertDescription>
            {errorProfile?.message ||
              errorSchedule?.message ||
              'Não foi possível carregar o horário. Tente novamente mais tarde.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!scheduleData || scheduleData.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Horário</h1>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhum horário disponível
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              Não há aulas programadas no momento. Entre em contato com a
              secretaria para mais informações.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatarHora = (hora: string) => hora.substring(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Meu Horário</h1>
      </div>

      <div className="max-w-40">
        <Select value={diaSelecionado} onValueChange={setDiaSelecionado}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por dia da semana" />
          </SelectTrigger>
          <SelectContent>
            {diasDisponiveis.map((dia) => (
              <SelectItem key={dia} value={dia}>
                {dia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!temAulas ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              Nenhuma aula neste dia
            </h3>
            <p className="text-muted-foreground text-center">
              Não há aulas programadas para{' '}
              {diaSelecionado === 'Todos' ? 'a semana' : diaSelecionado}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {diasParaMostrar.map(
            ([dia, aulas]) =>
              aulas.length > 0 && (
                <Card key={dia}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dia}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {aulas.map((aula, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border transition-colors"
                        >
                          <div className="flex-shrink-0 font-medium text-sm text-muted-foreground min-w-[140px] flex items-center gap-2">
                            <span className="font-bold">
                              {formatarHora(aula.hora_inicio)} -{' '}
                              {formatarHora(aula.hora_termino)}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="font-semibold text-base">
                              {aula.disciplina}
                            </div>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                              <span className="flex items-center gap-1">
                                {aula.sala}
                              </span>
                              <span className="flex items-center gap-1">
                                {aula.tipo.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      )}
    </div>
  )
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-9 w-48" />
      </div>

      <div className="max-w-xs">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((day) => (
          <Card key={day}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border"
                  >
                    <div className="flex-shrink-0 min-w-[140px]">
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
