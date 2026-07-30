import { AlertTriangle } from 'lucide-react'
import { RegistrationsUCSection } from './section'
import { RegistrationsUCResume } from './resume'
import type { Grade } from '@/types/grade'

interface RegistrationsUCAvailableProps {
  pendingSubjects: Grade[]
  subject: Grade[]
  requerTaxa?: boolean
}

export function RegistrationsUCAvailable({
  pendingSubjects,
  subject,
  requerTaxa = false,
}: RegistrationsUCAvailableProps) {
  return (
    <>
      {requerTaxa && (
        <div className="animate-in fade-in-0 slide-in-from-top-2 mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 duration-300">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium">
              Confirmação fora do prazo
            </p>
            <p className="text-xs text-amber-800">
              O prazo normal já terminou. A confirmação das disciplinas
              abaixo será feita mediante o pagamento de uma taxa adicional.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="my-2 flex items-center justify-between">
          <p>Disciplinas Disponíveis</p>
        </div>

        <div className="space-y-6">
          <RegistrationsUCSection
            label="Pendentes"
            subjects={pendingSubjects}
            secktionKey="pendents"
          />
          <RegistrationsUCSection
            label="Novas"
            subjects={subject}
            secktionKey="new"
          />
        </div>
      </div>

      <RegistrationsUCResume />
    </>
  )
}