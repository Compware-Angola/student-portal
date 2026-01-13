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

import { Search, Loader2 } from 'lucide-react'
import z from 'zod'
import type { searchDebtSchema } from '../schemas'
import type { UseFormReturn } from 'react-hook-form'

type SearchDebtFormData = z.infer<typeof searchDebtSchema>

type SearchDebtProps = {
  searchForm: UseFormReturn<SearchDebtFormData>
  onSearchDebt: (data: SearchDebtFormData) => Promise<void>
  isSearching: boolean // ADICIONADO AQUI
}

export function SearchDebt({
  searchForm,
  onSearchDebt,
  isSearching,
}: SearchDebtProps) {
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

            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pesquisando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar Dívidas
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
