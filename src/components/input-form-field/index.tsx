import { useState } from 'react'
import { type FieldValues } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '../ui/input'
import { type InputFormFieldProps } from './type'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

export function InputFormField<T extends FieldValues>(
  props: InputFormFieldProps<T>,
) {
  const { control, name, placeholder, label, type, disabled } = props
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
            <div className={isPassword ? 'relative' : undefined}>
              <Input
                autoComplete={isPassword ? 'current-password' : 'off'}
                {...field}
                disabled={disabled}
                placeholder={placeholder}
                type={inputType}
                className={isPassword ? 'pr-10' : undefined}
              />
              {isPassword && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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