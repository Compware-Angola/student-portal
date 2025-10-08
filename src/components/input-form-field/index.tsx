import {type FieldValues } from 'react-hook-form'

import { Input } from '../ui/input'

import {type InputFormFieldProps } from './type'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

export function InputFormField<T extends FieldValues>(props: InputFormFieldProps<T>) {
  const { control, name, placeholder, label, type, disabled } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} disabled={disabled} placeholder={placeholder} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}