
import { RegistrationsUCSection } from './section'
import { RegistrationsUCResume } from './resume'
import type { Grade } from '@/types/grade'

interface RegistrationsUCAvailableProps {
  pendingSubjects: Grade[]
  subject: Grade[]
}

export function RegistrationsUCAvailable({
  pendingSubjects,
  subject,
}: RegistrationsUCAvailableProps) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between my-2">
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