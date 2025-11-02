import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Search } from 'lucide-react'
import z from 'zod'
import type { searchDebtSchema } from '../schemas'
import type { UseFormReturn } from 'react-hook-form'

type SearchDebtFormData = z.infer<typeof searchDebtSchema>
type SearchDebtProps = {
  searchForm: UseFormReturn<SearchDebtFormData>
  onSearchDebt: (data: SearchDebtFormData) => Promise<void>
}
export function SearchDebt({ searchForm, onSearchDebt }: SearchDebtProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar Dívidas em Aberto
        </CardTitle>
        <CardDescription>
          Informe seus dados para consultar as dívidas pendentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* */}
        <Form {...searchForm}>
          <form
            onSubmit={searchForm.handleSubmit(onSearchDebt)}
            className="space-y-4"
          >
            <FormField
              control={searchForm.control}
              name="enrollmentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Matrícula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField disabled
              control={searchForm.control}
              name="academicYear"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Ano Académico</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl >
                      <SelectTrigger >
                        <SelectValue placeholder="Selecione o ano académico" aria-disabled />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent >
                      <SelectItem value="2020-2021">2020-2021</SelectItem>
                      <SelectItem value="2021-2022">2021-2022</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Buscar Dívidas
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
