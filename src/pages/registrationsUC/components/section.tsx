import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Lock } from 'lucide-react'

import { SubjectCard } from './subject-card'

import type { SectionKey } from '../types/registrations-uc'
import type { Grade } from '@/types/grade'
import { useRegistrationsUC } from '../hooks/use-registrations-uc'

type SectionProps = {
  label: string
  secktionKey: SectionKey
  subjects: Grade[]
}

export function RegistrationsUCSection({
  label,
  subjects,
  secktionKey,
}: SectionProps) {
  const {
    toggleSection,
    isSelected,
    toggleSubject,
    isExpanded,
    hasUnselectedPendents,
  } = useRegistrationsUC()

  if (subjects.length === 0) return null

  // A secção "Novas" fica bloqueada enquanto houver disciplinas pendentes
  // por selecionar — é preciso finalizar as pendentes primeiro.
  const isLocked = secktionKey === 'new' && hasUnselectedPendents

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {label}
            <span className="text-sm ">({subjects.length})</span>
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSection(secktionKey)}
          >
            {isExpanded[secktionKey] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded[secktionKey] && (
        <CardContent className="space-y-3 pt-4">
          {isLocked && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">
                Selecione primeiro todas as disciplinas pendentes para poder
                inscrever cadeiras novas.
              </p>
            </div>
          )}

          <div
            className={
              isLocked
                ? 'pointer-events-none select-none opacity-50'
                : undefined
            }
            aria-disabled={isLocked}
          >
            <div className="space-y-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.codigoGrade}
                  subject={subject}
                  isSelected={isSelected}
                  toggleSubject={toggleSubject}
                />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
