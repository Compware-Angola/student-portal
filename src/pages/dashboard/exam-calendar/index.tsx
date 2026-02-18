import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, MapPin, FileText, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useQueryAcademicTestSchedule } from '@/hooks/schedule/use-query-academic-test-schedule'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import {
  format,
  parseISO,
  isToday,
  isPast,
  isFuture,
  differenceInDays,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useYearSelect } from '@/components/year-select/use-year-select.ts'
import { YearSelect } from '@/components/year-select'
import { useQuerySemesters } from '@/hooks/semester/use-query-semester'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const ExamCalendar = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'today' | 'upcoming'
  >('all')
  const [selectedSemester, setSelectedSemester] = useState<string>('1')
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const { isError: isProfileError, profileData } = useQueryProfile()

  // Extraímos isLoading para controlar o estado de carregamento
  const {
    data: exams = [],
    isError: isExamError,
    isLoading: isLoadingExams,
  } = useQueryAcademicTestSchedule({
    academicYear: selectedYear,
    semester: selectedSemester,
    enrollmentCode: profileData?.enrollmentCode,
  })

  const { academicYears } = useYearSelect(profileData?.enrollmentCode)
  const { data: semestersResponse, isLoading: isLoadingSemesters } =
    useQuerySemesters()
  const semesters = semestersResponse?.items ?? []

  useEffect(() => {
    if (academicYears && !selectedYear) {
      const active = academicYears.find((y) => y.estado === 'Activo')
      if (active) setSelectedYear(String(active.codigo))
    }
  }, [academicYears, selectedYear])

  useEffect(() => {
    if (isProfileError) toast.error('Erro ao carregar dados do perfil')
    if (isExamError) toast.error('Erro ao carregar Calendário Acadêmico')
  }, [isProfileError, isExamError])

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return {
        full: format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }),
        short: format(date, 'dd/MM', { locale: ptBR }),
        weekDay: format(date, 'EEEE', { locale: ptBR }),
      }
    } catch {
      return { full: 'Data inválida', short: '-', weekDay: '-' }
    }
  }

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'completed', label: 'Realizadas' },
    { key: 'today', label: 'Hoje' },
    { key: 'upcoming', label: 'Futuras' },
  ] as const

  const formatTime = (timeString?: string) => timeString?.slice(0, 5) || '--:--'

  const getExamStatus = (examDate: string, examTime: string) => {
    const cleanDate = examDate.trim()
    const cleanTime = examTime.trim().slice(0, 5)
    const exam = parseISO(`${cleanDate}T${cleanTime}`)

    if (isNaN(exam.getTime())) {
      return { label: 'Desconhecido', color: 'bg-gray-50 text-gray-500' }
    }

    const today = new Date()
    const daysDiff = differenceInDays(exam, today)

    if (isPast(exam) && !isToday(exam)) {
      return {
        label: 'Realizada',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
      }
    }

    if (isToday(exam)) {
      return {
        label: 'Hoje',
        color: 'bg-red-100 text-red-800 border-red-200',
      }
    }

    if (isFuture(exam)) {
      if (daysDiff <= 3) {
        return {
          label: `Em ${daysDiff} dia${daysDiff > 1 ? 's' : ''}`,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
        }
      }
      return {
        label: `Em ${daysDiff} dias`,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
      }
    }

    return { label: 'Desconhecido', color: 'bg-gray-50 text-gray-500' }
  }

  const filteredExams = useMemo(() => {
    return exams
      .map((exam) => {
        const examDateObj = parseISO(exam.data_prova)
        const status = getExamStatus(exam.data_prova, exam.hora_termino)
        return {
          ...exam,
          status,
          formattedDate: formatDate(exam.data_prova),
          examDateObj,
        }
      })
      .filter((exam) => {
        if (statusFilter !== 'all') {
          const date = exam.examDateObj
          if (
            (statusFilter === 'completed' && !isPast(date)) ||
            (statusFilter === 'today' && !isToday(date)) ||
            (statusFilter === 'upcoming' && !isFuture(date))
          )
            return false
        }
        return true
      })
      .sort((a, b) => a.examDateObj.getTime() - b.examDateObj.getTime())
  }, [exams, statusFilter])

  const stats = useMemo(() => {
    const total = exams.length
    const upcoming = exams.filter((p) =>
      isFuture(parseISO(p.data_prova)),
    ).length
    const completed = exams.filter((p) => isPast(parseISO(p.data_prova))).length
    return { total, upcoming, completed }
  }, [exams])

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

      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Calendário de Provas
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {['Total', 'Futuras', 'Realizadas'].map((title, i) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingExams ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div
                  className={`text-2xl font-bold ${
                    i === 1 ? 'text-blue-700' : i === 2 ? 'text-gray-700' : ''
                  }`}
                >
                  {i === 0
                    ? stats.total
                    : i === 1
                      ? stats.upcoming
                      : stats.completed}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Estado:</span>
          {filters.map((filter) => (
            <Button
              key={filter.key}
              className="min-w-[100px] font-medium border"
              variant={statusFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.key)}
              disabled={isLoadingExams}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <YearSelect
          academicYears={academicYears}
          selectedYear={selectedYear}
          onChange={(val) => setSelectedYear(val)}
        />

        <Select
          value={selectedSemester}
          onValueChange={setSelectedSemester}
          disabled={isLoadingSemesters || isLoadingExams}
        >
          <SelectTrigger className="min-w-[120px]">
            <SelectValue placeholder="Semestre" />
          </SelectTrigger>
          <SelectContent>
            {semesters
              .filter((s) => s.codigo !== 3)
              .map((s) => (
                <SelectItem key={s.codigo} value={String(s.codigo)}>
                  {s.designacao}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exam list / Loading State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoadingExams ? (
          // Skeletons enquanto carrega
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : filteredExams.length > 0 ? (
          // Lista Real
          filteredExams.map((exam) => (
            <Card
              key={`${exam.codigo}-${exam.data_prova}-${exam.hora_prova}`}
              className="hover:bg-muted transition-colors cursor-default"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg leading-tight">
                      {exam.disciplina}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {exam.tipo_prova} • {exam.modalidade}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${exam.status.color} border whitespace-nowrap`}
                  >
                    {exam.status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-foreground">
                    {exam.formattedDate.full} ({exam.formattedDate.weekDay})
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-foreground">
                    {formatTime(exam.hora_prova)} às{' '}
                    {formatTime(exam.hora_termino)}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-foreground">Sala: {exam.sala}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Estado Vazio
          <Card className="lg:col-span-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhuma prova encontrada para os filtros selecionados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
