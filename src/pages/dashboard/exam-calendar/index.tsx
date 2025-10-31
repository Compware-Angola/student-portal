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

export const ExamCalendar = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'today' | 'upcoming'
  >('all')

  const { isError: isProfileError, profileData } = useQueryProfile()
  const { data: exams = [], isError: isExamError } =
    useQueryAcademicTestSchedule({
      academicYear: profileData?.confirmacoes[0].ano_lectivo,
      semester: '1',
      enrollmentCode: profileData?.enrollmentCode,
    })

  useEffect(() => {
    if (isProfileError) toast.error('Erro ao carregar dados do perfil')
    if (isExamError) toast.error('Erro ao carregar Calendário Acadêmico')
  }, [isProfileError, isExamError])

  /** 🔹 Format date using date-fns */
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
    const cleanTime = examTime.trim().slice(0, 5) // pega só HH:mm
    const exam = parseISO(`${cleanDate}T${cleanTime}`)

    if (isNaN(exam.getTime())) {
      console.warn('Invalid exam date:', cleanDate, cleanTime)
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
      } else if (daysDiff <= 7) {
        return {
          label: `Em ${daysDiff} dias`,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        }
      } else {
        return {
          label: `Em ${daysDiff} dias`,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
        }
      }
    }

    return { label: 'Desconhecido', color: 'bg-gray-50 text-gray-500' }
  }

  /** 🔹 Build and filter exams */
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

  /** 🔹 Statistics */
  const stats = useMemo(() => {
    const total = exams.length
    const upcoming = exams.filter((p) =>
      isFuture(parseISO(p.data_prova)),
    ).length
    const completed = exams.filter((p) => isPast(parseISO(p.data_prova))).length
    const written = exams.filter((p) => p.tipo_prova === 'Prova Escrita').length
    const lab = exams.filter(
      (p) => p.tipo_prova === 'Prova Laboratorial',
    ).length

    return { total, upcoming, completed, written, lab }
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

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Futuras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {stats.upcoming}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Realizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
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
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Exam list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <Card
            key={`${exam.codigo}-${exam.data_prova}-${exam.hora_prova}`}
            className="hover:bg-muted"
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{exam.disciplina}</CardTitle>
                  <CardDescription>
                    {exam.tipo_prova} • {exam.modalidade}
                  </CardDescription>
                </div>
                <Badge className={`${exam.status.color} border`}>
                  {exam.status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {exam.formattedDate.full} ({exam.formattedDate.weekDay})
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(exam.hora_prova)} às {formatTime(exam.hora_termino)}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Sala: {exam.sala}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            Nenhuma prova encontrada para os filtros selecionados.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
