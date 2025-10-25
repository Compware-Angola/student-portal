import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEnrollment } from '../hooks/use-enrollment'
import { SubjectCard } from './subject-card'
import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'

type SectionProps = {
  label: 'ANUAL' | 'I SEMESTRE' | 'II SEMESTRE'

  subjects: NewStudentCurriculumSubject[]
}

export function EnrollmentSection({ label, subjects }: SectionProps) {
  const { expandedSections, toggleSection, isSelected, toggleSubject } =
    useEnrollment()

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
            onClick={() => toggleSection(label)}
          >
            {expandedSections[label] ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {expandedSections[label] && (
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
