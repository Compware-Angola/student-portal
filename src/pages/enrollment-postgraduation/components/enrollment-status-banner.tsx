import { MapPin, Clock, IdCard, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { StudentProfile } from '@/services/profile'



interface EnrollmentStatusBannerProps {
  profileData: StudentProfile
}
export function EnrollmentStatusBanner({ profileData }: EnrollmentStatusBannerProps) {
  return (
    <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-background to-emerald-100/30 pl-8 dark:from-emerald-950/20 dark:via-background dark:to-emerald-900/10 shadow-sm">
      <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-r-md" />
      <CardContent className="p-6 pl-2"> 
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Matrícula Activa • {profileData.tipo_candidatura_designacao}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {profileData.curso}
            </h2>
            <p className="text-sm text-muted-foreground">
              Estudante: <span className="font-medium text-foreground">{profileData.nome_completo}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card/80 p-3 shadow-xs md:self-start">
            <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <IdCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Nº de Estudante</p>
              <p className="text-sm font-bold tracking-wide">{profileData.codigo_aluno}</p>
            </div>
          </div>
        </div>
        <hr className="my-5 border-border/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground">Polo</p>
              <p className="font-medium">{profileData.polo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-muted p-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground">Período</p>
              <p className="font-medium">{profileData.periodo}</p>
            </div>
          </div>

         
        </div>
      </CardContent>
    </Card>
  )
}