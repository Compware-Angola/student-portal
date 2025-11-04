import { useState } from 'react'
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
import { Upload, Send, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryCreateSupport, useQuerySupportTypes } from '@/hooks/support/use-query-support'
import type { SupportPayload } from '@/services/support/support.service'


export const Suporte = () => {
  const [formData, setFormData] = useState({
    tipoSuporte: '',
    assunto: '',
    mensagem: '',
    arquivo: null as File | null,
  })

  // Hooks para API
  const { data: supportTypes, isLoading: isTypesLoading } = useQuerySupportTypes()
  const { mutate, isPending: isSubmitting } = useQueryCreateSupport()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, arquivo: e.target.files[0] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tipoSuporte || !formData.assunto || !formData.mensagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const payload: SupportPayload = {
      descricao: formData.mensagem,
      assunto: formData.assunto,
      tipo_suporte: Number(formData.tipoSuporte),
    }

    // Chamada à API
    mutate(payload)

    // Limpar formulário
    setFormData({
      tipoSuporte: '',
      assunto: '',
      mensagem: '',
      arquivo: null,
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground mt-2">
          Precisa de ajuda? Envie-nos o seu pedido
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Formulário de Suporte</CardTitle>
              <CardDescription>
                Descreva a sua questão ou problema. A nossa equipa responderá em
                breve.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <SelectTrigger id="tipoSuporte">
                  <SelectValue placeholder="Selecione o tipo de suporte" />
                </SelectTrigger>
                <SelectContent>
                  {supportTypes?.map((type) => (
                    <SelectItem key={type.codigo} value={type.codigo}>
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

            <div className="space-y-2">
              <Label htmlFor="mensagem">
                Mensagem <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="mensagem"
                placeholder="Descreva detalhadamente a sua questão ou problema..."
                rows={8}
                value={formData.mensagem}
                onChange={(e) =>
                  setFormData({ ...formData, mensagem: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 relative group">
              <Label htmlFor="arquivo">Anexar Arquivo (Opcional)</Label>
              <div className="flex items-center gap-3">
                <Input
                  disabled
                  id="arquivo"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-not-allowed"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Tooltip */}
              <span className="absolute left-0 mt-1 hidden w-max rounded bg-gray-800 px-2 py-1 text-xs text-white group-hover:block">
                Temporariamente indisponível o Anexo de Fixeiros
              </span>

              {formData.arquivo && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {formData.arquivo.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceites: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
              </p>
            </div>


            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    tipoSuporte: '',
                    assunto: '',
                    mensagem: '',
                    arquivo: null,
                  })
                }
              >
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • O tempo de resposta médio é de 24-48 horas em dias úteis
          </p>
          <p className="text-sm text-muted-foreground">
            • Verifique as respostas em "Mensagens e Comunicados"
          </p>
          <p className="text-sm text-muted-foreground">
            • Para questões urgentes, contacte directamente os Serviços
            Académicos
          </p>
          <p className="text-sm text-muted-foreground">
            • Inclua o máximo de detalhes possível para uma resposta mais
            eficiente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
