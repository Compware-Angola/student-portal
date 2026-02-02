import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
  const { toggleSection, isSelected, toggleSubject, isExpanded } =
    useRegistrationsUC()

  if (subjects.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {label}
            <span className="text-sm ">({subjects.length})</span>
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
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.codigoGrade}
              subject={subject}
              isSelected={isSelected}
              toggleSubject={toggleSubject}
            />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
