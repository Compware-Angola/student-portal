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
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
const academicDataSchema = z.object({
  previousSchool: z.string().min(3, 'Escola anterior é obrigatória'),
  graduationYear: z.string().min(1, 'Ano de conclusão é obrigatório'),
  averageGrade: z.string().min(1, 'Média final é obrigatória'),
})
type AcademicData = z.infer<typeof academicDataSchema>
interface IAcademicData {
  onHandleSubmitAcademic(): void;
  onHandleGoback(): void;
}

export function AcademicData({onHandleGoback,onHandleSubmitAcademic}:IAcademicData) {
  const [formData, setFormData] = useState<{
    academic?: AcademicData
  }>({})
  const academicForm = useForm<AcademicData>({
    resolver: zodResolver(academicDataSchema),
    defaultValues: formData.academic || {},
  })
  const onSubmitAcademic = (data: AcademicData) => {
    setFormData((prev) => ({ ...prev, academic: data }))
    toast.success('Dados académicos salvos!')
    onHandleSubmitAcademic();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Académicos</CardTitle>
        <CardDescription>
          Informações sobre o curso e histórico académico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...academicForm}>
          <form
            onSubmit={academicForm.handleSubmit(onSubmitAcademic)}
            className="space-y-4"
          >
            <FormField
              control={academicForm.control}
              name="previousSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instituição de Ensino</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da escola" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={academicForm.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano de Conclusão</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={academicForm.control}
                name="averageGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Média Final</FormLabel>
                    <FormControl>
                      <Input placeholder="16.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onHandleGoback}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button type="submit">
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
