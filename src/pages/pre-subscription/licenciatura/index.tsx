import {
  FormPreSubscriptionProvider,
  useFormPreSubscriptionForm,
} from './components/form-provider'
import { ProgressBar } from './components/progress-bar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SpepNavigation } from './components/spep-navigation'
import { Label } from '@/components/ui/label'
import { Download, FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryTopicoByAnoLetivo } from '@/hooks/topic/use-query-topico'
import { useGetFileUrl } from '@/hooks/upload/use-upload'

export function PreSubscriptionLicenciatura() {
  const { data: currentAcademicYear, isLoading: isLoadingCurrentAcademicYear } =
    useQueryCurrentAcademicYear(1)

  /**
   * The topic is always fetched for the current academic year.
   * The student cannot select other years.
   */
  const {
    data: selectedTopico,
    isLoading: isLoadingTopico,
    isError: isErrorTopico,
  } = useQueryTopicoByAnoLetivo(currentAcademicYear?.codigo)

  const { mutateAsync: getFileUrlAsync } = useGetFileUrl()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!selectedTopico?.arquivo || isDownloading) {
      return
    }

    setIsDownloading(true)

    try {
      const { url } = await getFileUrlAsync({
        key: selectedTopico.arquivo,
        expiry: 3600,
      })

      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao baixar tópico:', error)
      toast.error('Não foi possível baixar o tópico. Tente novamente.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          TÓPICOS DO EXAME DE ACESSO
          ===================================================== */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-xl">
                Tópicos do Exame de Acesso
              </CardTitle>

              <CardDescription>
                Consulte e baixe os tópicos do exame de acesso para o ano letivo
                atual.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* =================================================
              ANO LETIVO
              ================================================= */}
          <div className="max-w-md space-y-2">
            <Label htmlFor="ano-letivo">Ano Letivo</Label>

            <div
              id="ano-letivo"
              className="flex h-11 items-center rounded-md border bg-muted/30 px-3 text-sm"
            >
              {isLoadingCurrentAcademicYear
                ? 'A carregar ano letivo atual...'
                : currentAcademicYear?.designacao}
            </div>
          </div>

          {/* =================================================
              LOADING TOPIC
              ================================================= */}
          {currentAcademicYear && isLoadingTopico && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 animate-pulse" />

                <p className="text-sm text-muted-foreground">
                  A carregar tópico...
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              TOPIC FOUND
              ================================================= */}
          {currentAcademicYear &&
            !isLoadingTopico &&
            !isErrorTopico &&
            selectedTopico && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{selectedTopico.designacao}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedTopico.arquivo
                        ? 'Documento disponível para download'
                        : 'Documento indisponível para download'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* =================================================
              TOPIC ERROR
              ================================================= */}
          {currentAcademicYear && !isLoadingTopico && isErrorTopico && (
            <div className="rounded-lg border border-destructive/30 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-destructive" />

                <p className="text-sm text-destructive">
                  Ocorreu um erro ao carregar o tópico. Tente novamente.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              NO TOPIC
              ================================================= */}
          {currentAcademicYear &&
            !isLoadingTopico &&
            !isErrorTopico &&
            !selectedTopico && (
              <div className="rounded-lg border border-dashed p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Não existem tópicos disponíveis para o ano letivo atual.
                  </p>
                </div>
              </div>
            )}

          {/* =================================================
              DOWNLOAD
              ================================================= */}
          <div className="pt-1">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={
                !selectedTopico?.arquivo || isLoadingTopico || isDownloading
              }
              className="gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              {isDownloading ? 'A baixar...' : 'Baixar Tópico'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          FORMULÁRIO DE CANDIDATURAS
          ===================================================== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Formulário de Candidaturas
        </h1>

        <p className="mt-2 text-muted-foreground">
          Preencha o formulário para realizar a pré-inscrição ao exame de acesso
        </p>
      </div>

      <FormPreSubscriptionProvider>
        <Licenciatura />
      </FormPreSubscriptionProvider>
    </div>
  )
}

function Licenciatura() {
  const { steps, currentStep, form, onSubmit } = useFormPreSubscriptionForm()

  const StepComponent = steps[currentStep].component

  return (
    <>
      <ProgressBar />

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>

          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <StepComponent />

              <SpepNavigation />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
