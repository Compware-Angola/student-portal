import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FieldValues } from 'react-hook-form'
import type { SelectFormFieldProps } from './type'
import { cn } from '@/lib/utils'

export function SelectFormField<T extends FieldValues>(
  props: SelectFormFieldProps<T>,
) {
  const {
    control,
    name,
    placeholder,
    label,
    items,
    disabled,
    fullWidth = false,
    trigger: Trigger,
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Garante que o valor do field só é considerado "válido" se
        // corresponder de facto a um item existente na lista.
        const hasMatch = items.some(
          (item) => String(item.value) === String(field.value ?? ''),
        )
        const selectValue = hasMatch ? String(field.value) : undefined

        return (
          <FormItem>
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            <Select
              // 🔑 Força o Radix a remontar o Select quando o valor real
              // finalmente corresponde a um item da lista. Isto resolve
              // o bug do Radix em que o SelectValue não mostra o label
              // se o SelectItem nunca chegou a montar antes do valor
              // ser setado programaticamente (setValue via API).
              key={`${name}-${items.length}-${selectValue ?? 'empty'}`}
              disabled={disabled}
              value={selectValue}
              onValueChange={field.onChange}
            >
              <FormControl>
                {Trigger ? (
                  <Trigger />
                ) : (
                  <SelectTrigger
                    className={cn(
                      'cursor-pointer overflow-hidden',
                      fullWidth && 'w-full',
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                )}
              </FormControl>
              <SelectContent>
                {items.map((item, index) => (
                  <SelectItem
                    key={`${item.value}-${index}-${name}`}
                    className="cursor-pointer"
                    value={String(item.value)}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
