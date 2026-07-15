import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '../ui/input'
import type { InputFormFieldProps } from './type'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

export function InputFormField<T extends FieldValues>(
  props: InputFormFieldProps<T>,
) {
  const {
    control,
    name,
    placeholder,
    label,
    type,
    disabled,
    icon: Icon,
  } = props

  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
                autoComplete={isPassword ? 'current-password' : 'off'}
                disabled={disabled}
                placeholder={placeholder}
                type={inputType}
                className={cn(
                  'h-11 px-10 rounded-lg bg-slate-50 border-slate-200',
                  Icon ? 'pl-10' : '',
                  isPassword ? 'pr-10' : '',
                )}
              />
              {isPassword && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
