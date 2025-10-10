import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormFieldProps = {
  label: string
  value: string
}

export function InputWithLabel({ label, value }: FormFieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email">{label}</Label>
      <Input type="email" id="email" value={value} disabled />
    </div>
  )
}
