import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Hourglass, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { AdmissionStatus } from '@/enums/admission.status.enum'

interface PreResultCardProps {
  studentStatus: string
}
const PreResultCard = ({ studentStatus }: PreResultCardProps) => {
  const navigate = useNavigate()
  return (
    <>
      <div>
        {/* Aguardando resultados */}
        <Card
          className={
            studentStatus === AdmissionStatus.AGUARDANDO_RESULTADO
              ? 'border-l-4 block border-l-amber-500 ring-1 ring-amber-500/20'
              : 'opacity-60 hidden'
          }
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10">
                <Hourglass className="h-5 w-5 text-amber-600" />
              </div>
              {studentStatus === AdmissionStatus.AGUARDANDO_RESULTADO && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                  Atual
                </Badge>
              )}
            </div>
            <CardTitle className="text-base mt-3">
              Aguardando Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Os resultados do seu exame de admissão ainda estão a ser
              processados. Por favor, aguarde a publicação oficial.
            </p>
          </CardContent>
        </Card>

        {/* Admitido */}
        <Card
          className={
            studentStatus === AdmissionStatus.ADMITIDO_SEM_MATRICULA
              ? 'border-l-4 block border-l-success ring-1 ring-success/20'
              : 'opacity-60 hidden'
          }
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              {studentStatus === AdmissionStatus.ADMITIDO_SEM_MATRICULA && (
                <Badge className="bg-success hover:bg-success text-white">
                  Aprovado
                </Badge>
              )}
            </div>
            <CardTitle className="text-base mt-3">Admitido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Parabéns! Você foi aprovado no exame de admissão. Avance para a
              matrícula para garantir a sua vaga.
            </p>
            {studentStatus === AdmissionStatus.ADMITIDO_SEM_MATRICULA && (
              <div>
                <Button
                  onClick={() => navigate('/matricula')}
                  className=" gap-1.5"
                >
                  Fazer Matrícula
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reprovado */}
        <Card
          className={
            studentStatus === AdmissionStatus.NAO_ADMITIDO
              ? 'border-l-4 border-l-destructive ring-1 block ring-destructive/20'
              : 'opacity-60 hidden'
          }
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              {studentStatus === AdmissionStatus.NAO_ADMITIDO && (
                <Badge variant="destructive">Não admitido</Badge>
              )}
            </div>
            <CardTitle className="text-base mt-3">Reprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Infelizmente não obteve a classificação necessária. Consulte os
              serviços académicos para mais informações sobre próximas
              oportunidades.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export { PreResultCard }
