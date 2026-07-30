import type { LucideIcon } from 'lucide-react'
import { type Control, type FieldValues, type Path } from 'react-hook-form'

export type InputFormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  placeholder?: string
  label?: string
  type?: string
  disabled?: boolean
  autoComplete?: string
  icon?: React.ComponentType
}

export type NumberInputFormFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  disabled?: boolean
  icon?: LucideIcon
  min?: number
  max?: number
  step?: number
}