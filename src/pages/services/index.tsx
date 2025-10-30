import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { BookOpen, DollarSign, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Subject {
  codigo: string
  nome: string
  nota_atual: number
  ano_letivo: string
  semestre: string
  custo_melhoria: number
}

export function AcademicServices() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  // Mock data - substituir por dados reais da API
  const availableSubjects: Subject[] = [
    {
      codigo: 'GSI-101',
      nome: 'Programação I',
      nota_atual: 12,
      ano_letivo: '2023-2024',
      semestre: '1º Semestre',
      custo_melhoria: 5000,
    },
    {
      codigo: 'GSI-102',
      nome: 'Matemática Discreta',
      nota_atual: 13,
      ano_letivo: '2023-2024',
      semestre: '1º Semestre',
      custo_melhoria: 5000,
    },
    {
      codigo: 'GSI-201',
      nome: 'Estruturas de Dados',
      nota_atual: 11,
      ano_letivo: '2023-2024',
      semestre: '2º Semestre',
      custo_melhoria: 5000,
    },
    {
      codigo: 'GSI-202',
      nome: 'Base de Dados I',
      nota_atual: 14,
      ano_letivo: '2023-2024',
      semestre: '2º Semestre',
      custo_melhoria: 5000,
    },
  ]

  const handleSubjectToggle = (codigo: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(codigo)
        ? prev.filter((c) => c !== codigo)
        : [...prev, codigo],
    )
  }

  const totalCost = selectedSubjects.length * 5000

  const handleProceedToPayment = () => {
    if (selectedSubjects.length === 0) {
      toast('Nenhuma cadeira selecionada')
      return
    }

    toast('Redirecionando para pagamento')
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Serviços Acadêmicos
        </h1>
        <p className="text-muted-foreground mt-2">
          Solicite melhorias de notas e outros serviços acadêmicos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Melhoria de Notas
          </CardTitle>
          <CardDescription>
            Selecione as cadeiras para as quais deseja solicitar melhoria de
            nota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableSubjects.map((subject) => (
              <div
                key={subject.codigo}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={subject.codigo}
                    checked={selectedSubjects.includes(subject.codigo)}
                    onCheckedChange={() => handleSubjectToggle(subject.codigo)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={subject.codigo}
                        className="font-medium cursor-pointer"
                      >
                        {subject.nome}
                      </label>
                      <Badge variant="outline">{subject.codigo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subject.ano_letivo} • {subject.semestre}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Nota Atual: {subject.nota_atual}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subject.custo_melhoria.toLocaleString()} Kz
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedSubjects.length > 0 && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {selectedSubjects.length} cadeira(s) selecionada(s)
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total a pagar</p>
                  <p className="text-2xl font-bold text-primary">
                    {totalCost.toLocaleString()} Kz
                  </p>
                </div>
              </div>
              <Button
                onClick={handleProceedToPayment}
                className="w-full"
                size="lg"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Proceder ao Pagamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
