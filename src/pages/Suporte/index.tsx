import { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Send, HelpCircle, Clock, MessageSquare, Phone, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import {
  useQueryCreateSupport,
  useQuerySupportTypes,
} from '@/hooks/support/use-query-support'
import type { SupportPayload } from '@/services/support/support.service'
import { useUploadSingle } from '@/hooks/upload/use-upload-single'

export const Suporte = () => {
  const [formData, setFormData] = useState({
    tipoSuporte: '',
    assunto: '',
    mensagem: '',
    arquivo: null as File | null,
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: supportTypes, isLoading: isTypesLoading } =
    useQuerySupportTypes()
  const { mutate: supportMutate, isPending: isSubmitting } =
    useQueryCreateSupport()
  const uploadMutation = useUploadSingle()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, arquivo: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tipoSuporte || !formData.assunto || !formData.mensagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    try {
      let uploadedFileName: string | null = null

      if (formData.arquivo) {
        const result = await uploadMutation.mutateAsync(formData.arquivo)
        uploadedFileName = result.file.filename
      }

      const payload: SupportPayload = {
        descricao: formData.mensagem,
        assunto: formData.assunto,
        tipo_suporte: Number(formData.tipoSuporte),
        file_name1: uploadedFileName,
      }

      supportMutate(payload)

      setFormData({
        tipoSuporte: '',
        assunto: '',
        mensagem: '',
        arquivo: null,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error('Erro ao enviar o pedido.')
    }
  }

  const infoItems = [
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      text: 'Tempo de resposta médio de 24–48 horas em dias úteis',
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      text: 'Verifique as respostas em "Mensagens e Comunicados"',
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      text: 'Para questões urgentes, contacte os Serviços Académicos directamente',
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-primary" />,
      text: 'Inclua o máximo de detalhes possível para uma resposta mais eficiente',
    },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground mt-1">
          Precisa de ajuda? Envie-nos o seu pedido e a nossa equipa responderá em breve.
        </p>
      </div>

      {/* Main grid: form + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Form — ocupa 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Formulário de Suporte</CardTitle>
                <CardDescription>
                  Descreva a sua questão ou problema com o máximo de detalhe.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Tipo + Assunto em grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoSuporte">
                    Tipo de Suporte <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.tipoSuporte}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoSuporte: value })
                    }
                    disabled={isTypesLoading}
                  >
                    <SelectTrigger id="tipoSuporte" className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTypes?.map((type) => (
                        <SelectItem key={type.codigo} value={String(type.codigo)}>
                          {type.designacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assunto">
                    Assunto <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="assunto"
                    placeholder="Descreva brevemente o assunto"
                    value={formData.assunto}
                    onChange={(e) =>
                      setFormData({ ...formData, assunto: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <Label htmlFor="mensagem">
                  Mensagem <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="mensagem"
                  placeholder="Descreva detalhadamente a sua questão ou problema..."
                  rows={8}
                  className="resize-none"
                  value={formData.mensagem}
                  onChange={(e) =>
                    setFormData({ ...formData, mensagem: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.mensagem.length} caracteres
                </p>
              </div>

              {/* Arquivo */}
              <div className="space-y-2 relative group">
                <Label htmlFor="arquivo">
                  Anexar Arquivo{' '}
                  <span className="text-muted-foreground font-normal">(Opcional)</span>
                </Label>
                <div className="flex items-center gap-3 border rounded-md px-3 py-2 bg-muted/30">
                  <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    id="arquivo"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none"
                  />
                </div>
                <span className="absolute left-0 mt-1 hidden w-max rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block z-10">
                  Temporariamente indisponível o Anexo de Ficheiros
                </span>
                {formData.arquivo && (
                  <p className="text-sm text-muted-foreground">
                    Ficheiro selecionado: <span className="font-medium">{formData.arquivo.name}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Formatos aceites: PDF, DOC, DOCX, JPG, PNG — máx. 10MB
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-1">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'A enviar...' : 'Enviar Pedido'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      tipoSuporte: '',
                      assunto: '',
                      mensagem: '',
                      arquivo: null,
                    })
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                >
                  Limpar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar de informações — ocupa 1/3 */}
        <div className="space-y-4">
          <Card className="bg-muted/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <p className="text-sm text-muted-foreground leading-snug">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card extra de dica */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-5 space-y-1">
              <p className="text-sm font-medium">Dica para uma resposta rápida</p>
              <p className="text-sm text-muted-foreground">
                Inclua o número de estudante e a descrição exacta do problema para agilizar a resolução.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}