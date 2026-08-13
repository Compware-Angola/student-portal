import type { FieldValues } from 'react-hook-form'

import { Input } from '../ui/input'
import type { NumberInputFormFieldProps } from './type'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

export function NumberInputFormField<T extends FieldValues>(
  props: NumberInputFormFieldProps<T>,
) {
  const {
    control,
    name,
    placeholder,
    label,
    disabled,
    icon: Icon,
    min = 0,
    max = 20,
    step = 0.1,
  } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              )}

              <Input
                name={field.name}
                ref={field.ref}
                value={field.value ?? ''}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const value = e.target.value

                  // Permite apagar completamente o valor
                  if (value === '') {
                    field.onChange('')
                    return
                  }

                  // Converte para número
                  const numberValue = Number(value)

                  if (!Number.isNaN(numberValue)) {
                    field.onChange(numberValue)
                  }
                }}
                type="number"
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  'h-11 rounded-lg bg-slate-50 border-slate-200',
                  Icon ? 'pl-10' : 'px-4',
                )}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}