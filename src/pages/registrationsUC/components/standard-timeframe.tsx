import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  TrendingUp,
} from 'lucide-react'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function StandardTimeframe() {

  const { profileData } = useQueryProfile()

  const { data: academicYear } = useQueryCurrentAcademicYear(profileData?.codigo_tipo_candidatura)

  const confirmacoes = profileData?.confirmacoes ?? []

  // Confirmação correspondente ao ano lectivo corrente
  const confirmacaoAtiva = confirmacoes.find(
    (c) => c.ano_lectivo === academicYear?.codigo
  )

  const matriculaPendente =
    confirmacaoAtiva && confirmacoes[0].estado === 0

  const classeAtual = confirmacaoAtiva?.classe
  const classeMaxima = confirmacoes.length
    ? Math.max(...confirmacoes.map((c) => c.classe))
    : undefined

  // Datas do ano lectivo (1º semestre ao 2º semestre)
  const inicioAnoLectivo = academicYear?.datainicioprimeirosemestre
  const fimAnoLectivo = academicYear?.datafimsegundosemestre

  // Datas do semestre corrente, se disponível
  const inicioSemestreAtual =
    academicYear?.semestre === 2
      ? academicYear?.datainiciosegundosemestre
      : academicYear?.datainicioprimeirosemestre

  const fimSemestreAtual =
    academicYear?.semestre === 2
      ? academicYear?.datafimsegundosemestre
      : academicYear?.datafimprimeirosemestre

  return (
    <div className="space-y-3">
      {!matriculaPendente ? (
  <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-background to-emerald-100/30 pl-8 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 shadow-sm">
      <CardHeader className="p-6 pl-2 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Ano Lectivo Activo
              </div>
              <CardTitle className="text-2xl">
                {academicYear?.designacao ?? '—'}
              </CardTitle>
              <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                  {classeAtual ?? '—'}ª Classe Activa
                </Badge>
                <span>{profileData?.curso ?? '—'}</span>
              </CardDescription>

              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(inicioAnoLectivo)} — {formatDate(fimAnoLectivo)}
              </p>
            </div>
          </div>

          {academicYear?.semestre && (
            <div className="rounded-lg border bg-card/80 px-4 py-2 text-right shadow-xs">
              <p className="text-xs font-medium text-muted-foreground">
                {academicYear.semestre}º Semestre
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(inicioSemestreAtual)} — {formatDate(fimSemestreAtual)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pl-2 pt-0">
        <hr className="mb-5 border-border/60" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Período</p>
            </div>
            <p className="text-xl font-bold">{profileData?.periodo ?? '—'}</p>
            <p className="text-xs text-muted-foreground">No ano atual</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Polo</p>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {profileData?.polo ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">A decorrer</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Classe Máxima</p>
            </div>
            <p className="text-xl font-bold">{classeMaxima ?? '—'}ª</p>
            <p className="text-xs text-muted-foreground">Já inscrito</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Cadeirante</p>
            </div>
            <p className="text-xl font-bold">{confirmacaoAtiva?.cadeirante ?? '—'}</p>
            <p className="text-xs text-muted-foreground">Este ano</p>
          </div>
        </div>
      </CardContent>
    </Card>
      ) : (
        <Card className="overflow-hidden border-red-200">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 mx-auto h-24 w-24 animate-ping rounded-full bg-red-400 opacity-75" />
              <div className="relative animate-bounce-slow">
                <AlertCircle className="h-20 w-20 text-red-600 drop-shadow-lg" />
              </div>
            </div>

            <h3 className="mb-2 text-xl font-bold text-red-900">
              Matrícula Pendente
            </h3>

            <p className="max-w-md leading-relaxed text-red-700">
              Por favor, verifique a situação do seu pagamento no sistema ou
              dirija-se à secretaria para regularizar a situação e concluir a
              matrícula.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}





interface AcademicYearSummaryBannerProps {
  profileData?: any
  academicYear?: any
  classeAtual?: number | string
  classeMaxima?: number | string
  confirmacaoAtiva?: any
  inicioAnoLectivo?: string | Date
  fimAnoLectivo?: string | Date
  inicioSemestreAtual?: string | Date
  fimSemestreAtual?: string | Date
  formatDate: (date?: string | Date) => string
}

export function AcademicYearSummaryBanner({
  profileData,
  academicYear,
  classeAtual,
  classeMaxima,
  confirmacaoAtiva,
  inicioAnoLectivo,
  fimAnoLectivo,
  inicioSemestreAtual,
  fimSemestreAtual,
  formatDate,
}: AcademicYearSummaryBannerProps) {
  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-background to-emerald-100/30 pl-8 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 shadow-sm">
      {/* Detalhe da borda verde na esquerda para padronização visual */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-500 rounded-r-md" />

      <CardHeader className="p-6 pl-2 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Ano Lectivo Activo
              </div>
              <CardTitle className="text-2xl">
                {academicYear?.designacao ?? '—'}
              </CardTitle>
              <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                  {classeAtual ?? '—'}ª Classe Activa
                </Badge>
                <span>{profileData?.curso ?? '—'}</span>
              </CardDescription>

              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(inicioAnoLectivo)} — {formatDate(fimAnoLectivo)}
              </p>
            </div>
          </div>

          {academicYear?.semestre && (
            <div className="rounded-lg border bg-card/80 px-4 py-2 text-right shadow-xs">
              <p className="text-xs font-medium text-muted-foreground">
                {academicYear.semestre}º Semestre
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(inicioSemestreAtual)} — {formatDate(fimSemestreAtual)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 pl-2 pt-0">
        <hr className="mb-5 border-border/60" />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Período</p>
            </div>
            <p className="text-xl font-bold">{profileData?.periodo ?? '—'}</p>
            <p className="text-xs text-muted-foreground">No ano atual</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Polo</p>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {profileData?.polo ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">A decorrer</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Classe Máxima</p>
            </div>
            <p className="text-xl font-bold">{classeMaxima ?? '—'}ª</p>
            <p className="text-xs text-muted-foreground">Já inscrito</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-medium">Cadeirante</p>
            </div>
            <p className="text-xl font-bold">{confirmacaoAtiva?.cadeirante ?? '—'}</p>
            <p className="text-xs text-muted-foreground">Este ano</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}