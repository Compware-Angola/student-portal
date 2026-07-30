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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && <Icon />}

              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === '') {
                    field.onChange(undefined)
                    return
                  }
                  const parsed = Number(raw)
                  field.onChange(Number.isNaN(parsed) ? raw : parsed)
                }}
                type="number"
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  'h-11 px-10 rounded-lg bg-slate-50 border-slate-200',
                  Icon ? 'pl-10' : '',
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