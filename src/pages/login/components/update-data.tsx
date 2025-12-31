import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { sendrenewDataRequest } from '@/services/auth/login.service'
import { useNavigate } from 'react-router-dom'

interface AtualizacaoDadosSimplesProps {
  emailInicial: string
}

export function AtualizacaoDadosSimples({
  emailInicial,
}: AtualizacaoDadosSimplesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newEmail: emailInicial,
    enrrolment: '',
    phone: '',
    details: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações rápidas no frontend
    if (!formData.enrrolment.trim()) {
      toast.error('Matrícula obrigatória')
      return
    }
    if (!formData.phone.trim()) {
      toast.error('Telefone obrigatório')
      return
    }
    if (formData.details.trim().length < 20) {
      toast.error('Explique melhor o motivo (mínimo 20 caracteres)')
      return
    }

    setIsLoading(true)

    try {
      await sendrenewDataRequest({
        email: formData.newEmail.trim(),
        enrrolment: formData.enrrolment.trim(),
        phone: formData.phone.trim(),
        details: formData.details.trim(),
        platform: 'PORTAL',
      })
      toast.success('Solicitação enviada com sucesso!', {
        description:
          'Sua solicitação foi recebida. A secretaria entrará em contato em breve.',
        duration: 8000,
      })
      navigate('/login')

      // Opcional: limpar ou fechar modal
      setFormData({
        newEmail: emailInicial,
        enrrolment: '',
        phone: '',
        details: '',
      })
    } catch (err: any) {
      console.error(err)
      toast.error('Falha ao enviar', {
        description: err.message || 'Tente novamente mais tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* E-mail atual (desativado) */}
      <div className="space-y-2">
        <Label>E-mail que você informou</Label>
        <Input value={emailInicial} disabled className="bg-muted" />
      </div>

      {/* Novo e-mail (editável) */}
      <div className="space-y-2">
        <Label htmlFor="newEmail">Novo e-mail (se mudou) *</Label>
        <Input
          id="newEmail"
          name="newEmail"
          type="email"
          placeholder="novo.email@dominio.com"
          value={formData.newEmail}
          onChange={handleChange}
          required
        />
      </div>

      {/* Matrícula */}
      <div className="space-y-2">
        <Label htmlFor="enrrolment">Número de Matrícula *</Label>
        <Input
          id="enrrolment"
          name="enrrolment"
          placeholder="Ex: 202300145"
          value={formData.enrrolment}
          onChange={handleChange}
          required
        />
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone de contato *</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+244 923 456 789"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <p className="text-xs text-muted-foreground">
          Formato: +244 923 456 789
        </p>
      </div>

      {/* Motivo / Detalhes */}
      <div className="space-y-2">
        <Label htmlFor="details">Motivo da solicitação *</Label>
        <Textarea
          id="details"
          name="details"
          placeholder="Explicação detalhada: quando mudou de e-mail, por que não recebe notificações, etc."
          value={formData.details}
          onChange={handleChange}
          required
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Mínimo 20 caracteres • Seja o mais claro possível
        </p>
      </div>

      {/* Botão */}
      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>Enviando solicitação...</>
        ) : (
          <>Enviar Solicitação à Secretaria</>
        )}
      </Button>
    </form>
  )
}
