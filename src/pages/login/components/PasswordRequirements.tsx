import { CheckCircle2, XCircle } from 'lucide-react'

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: 'Mínimo de 8 caracteres',
      isValid: password.length >= 8,
    },
    {
      label: 'Uma letra maiúscula',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'Um número',
      isValid: /[0-9]/.test(password),
    },
    {
      label: 'Um caractere especial',
      isValid: /[^a-zA-Z0-9]/.test(password),
    },
  ]

  const allValid = requirements.every(req => req.isValid)

  if (!password) return null

  return (
    <div className="mt-2 space-y-1.5">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          {req.isValid ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
          )}
          <span className={req.isValid ? 'text-green-700' : 'text-gray-500'}>
            {req.label}
          </span>
        </div>
      ))}
      
      {allValid && password.length > 0 && (
        <div className="mt-1.5 text-xs font-medium text-green-700 flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          ✓ Senha atende todos os requisitos
        </div>
      )}
    </div>
  )
}