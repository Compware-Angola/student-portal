import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const documentsSchema = z.object({
  pole: z.string().min(1, 'Polo é obrigatório'),
  intendedCourse: z.string().min(1, 'Curso é obrigatório'),
  secondOption: z.string().min(1, 'Curso é obrigatório'),
})

type DocumentsData = z.infer<typeof documentsSchema>

interface IDocumentsData {
  onHandleDocumentsData(): void
  onHandleGoback(): void
}

export function AcademicDocument({
  onHandleGoback,
  onHandleDocumentsData,
}: IDocumentsData) {
  const [formData, setFormData] = useState<{
    documents?: DocumentsData
  }>({})

  const documentsForm = useForm<DocumentsData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: formData.documents || {},
  })

  const onSubmitDocuments = (data: DocumentsData) => {
    setFormData((prev) => ({ ...prev, documents: data }))
    onHandleDocumentsData()
    toast.success('Informações de documentos salvas!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Candidatura</CardTitle>
        <CardDescription>
          Informações sobre Dados da Candidatura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...documentsForm}>
          <form onSubmit={documentsForm.handleSubmit(onSubmitDocuments)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={documentsForm.control}
                name="pole"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Polo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="luanda">Luanda</SelectItem>
                        <SelectItem value="benguela">Benguela</SelectItem>
                        <SelectItem value="huambo">Huambo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={documentsForm.control}
                name="intendedCourse"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Curso Pretendido</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="engenharia-informatica">
                          Engenharia Informática
                        </SelectItem>
                        <SelectItem value="gestao">Gestão</SelectItem>
                        <SelectItem value="direito">Direito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={onHandleGoback}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              <Button type="submit">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
