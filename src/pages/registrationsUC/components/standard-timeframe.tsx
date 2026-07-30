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

export function StandardTimeframe() {
  const { data: academicYear } = useQueryCurrentAcademicYear()
  const { profileData } = useQueryProfile()

  const confirmacoes = profileData?.confirmacoes ?? []

  // Confirmação correspondente ao ano lectivo corrente
  const confirmacaoAtiva = confirmacoes.find(
    (c) => c.ano_lectivo === academicYear?.codigo
  )

  const matriculaPendente =
    confirmacaoAtiva && confirmacaoAtiva.estado === 1

  const classeAtual = confirmacaoAtiva?.classe
  const classeMaxima = confirmacoes.length
    ? Math.max(...confirmacoes.map((c) => c.classe))
    : undefined

  return (
    <div className="space-y-3">
      {!matriculaPendente ? (
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.03] to-transparent">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
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
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {classeAtual ?? '—'}ª Classe Activa
                    </Badge>
                    <span>{profileData?.curso ?? '—'}</span>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Período</p>
                </div>
                <p className="text-2xl font-bold">
                  {profileData?.periodo ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground">No ano atual</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Polo</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {profileData?.polo ?? '—'}
                </p>
                <p className="text-xs text-muted-foreground">A decorrer</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Classe Máxima</p>
                </div>
                <p className="text-2xl font-bold">
                  {classeMaxima ?? '—'}ª
                </p>
                <p className="text-xs text-muted-foreground">
                  Já inscrito
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Cadeirante</p>
                </div>
                <p className="text-2xl font-bold">
                  {confirmacaoAtiva?.cadeirante ?? '—'}
                </p>
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