import {
  FormPreSubscriptionProvider,
  useFormPreSubscriptionForm,
} from "./components/form-provider";
import { ProgressBar } from "./components/progress-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SpepNavigation } from "./components/spep-navigation";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";


const mockTopicos = [
  {
    id: 1,
    anoLetivoId: 25,
    anoLetivo: "2025/2026",
    designacao: "Tópicos do Exame de Acesso — 2025/2026",
    arquivo: "topicos-exame-acesso-2025-2026.pdf",
    arquivoUrl: "/mock/topicos/topicos-exame-acesso-2025-2026.pdf",
  },
  {
    id: 2,
    anoLetivoId: 24,
    anoLetivo: "2024/2025",
    designacao: "Tópicos do Exame de Acesso — 2024/2025",
    arquivo: "topicos-exame-acesso-2024-2025.pdf",
    arquivoUrl: "/mock/topicos/topicos-exame-acesso-2024-2025.pdf",
  },
  {
    id: 3,
    anoLetivoId: 23,
    anoLetivo: "2023/2024",
    designacao: "Tópicos do Exame de Acesso — 2023/2024",
    arquivo: "topicos-exame-acesso-2023-2024.pdf",
    arquivoUrl: "/mock/topicos/topicos-exame-acesso-2023-2024.pdf",
  },
];
export function PreSubscriptionLicenciatura() {


  const [selectedAnoLetivo, setSelectedAnoLetivo] = useState<string>("");

const selectedTopico = mockTopicos.find(
  (topico) => String(topico.anoLetivoId) === selectedAnoLetivo,
);

const handleDownload = () => {
  if (!selectedTopico) return;

  window.open(selectedTopico.arquivoUrl, "_blank");
};
    return (
      <div className="space-y-6">

      <div className="space-y-6">
  {/* <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Tópicos
    </h1>

    <p className="mt-2 text-muted-foreground">
      Consulte e faça o download dos tópicos para preparação do exame de
      acesso.
    </p>
  </div> */}

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
            Selecione o ano letivo para consultar o respetivo tópico.
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-6 pt-6">
      <div className="max-w-md space-y-2">
        <Label htmlFor="ano-letivo">
          Ano Letivo
        </Label>

        <Select
          value={selectedAnoLetivo}
          onValueChange={setSelectedAnoLetivo}
        >
          <SelectTrigger id="ano-letivo" className="h-11">
            <SelectValue placeholder="Selecione o ano letivo" />
          </SelectTrigger>

          <SelectContent>
            {mockTopicos.map((topico) => (
              <SelectItem
                key={topico.id}
                value={String(topico.anoLetivoId)}
              >
                {topico.anoLetivo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTopico && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background border">
              <FileText className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {selectedTopico.designacao}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedTopico.arquivo}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-1">
        <Button
          type="button"
          onClick={handleDownload}
          disabled={!selectedTopico}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Tópico
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Formulário de Candidaturas
          </h1>
          <p className="text-muted-foreground mt-2">
            Preencha o formulário para realizar a pré-inscrição ao exame de
            acesso
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
            <StepComponent/>
              <SpepNavigation />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
