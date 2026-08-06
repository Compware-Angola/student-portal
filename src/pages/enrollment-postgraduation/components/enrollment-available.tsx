// components/enrollment-available.tsx
import { EnrollmentSection } from './enrollment-section'
import { EnrollmentResume } from './enrollment-resume'
import { AlertTriangle } from 'lucide-react'

interface EnrollmentAvailableProps {
  subject: any[] // troca pelo tipo real de "subject" que já usas no projeto
  requerTaxa?: boolean
}

export function EnrollmentAvailable({
  subject,
  requerTaxa,
}: EnrollmentAvailableProps) {
  return (
    <div className="space-y-6">
      {requerTaxa && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 duration-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium">
              Matrícula fora do prazo
            </p>
            <p className="text-xs text-amber-800">
              O prazo normal já terminou. A matrícula acima será feita mediante o pagamento de uma taxa adicional.
            </p>
          </div>
        </div>
      )}

      <EnrollmentSection
        label="Disciplinas Disponíveis"
        subjects={subject}
        
        sectionKey="new"
      />

      <EnrollmentResume />
    </div>
  )
}