import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { getSubject } from '@/services/subject.service'
import { useQuery } from '@tanstack/react-query'
import { Coins } from 'lucide-react'
import { useProfileData } from '@/hooks/use-profile-data'
import { toast } from 'sonner'
import {  addReconfirmEnrollment } from '@/services/enrollment.service'
import { generateReference } from '@/services/financial.service'
import { addDays, format } from 'date-fns'
import {useNavigate} from "react-router-dom"

interface SelectedSubject {
  disciplineId: string
  disciplineName: string
  semester: string
  status: string
  finalGrade: number
  startDate: string
  completionDate: string
  remarks: string
}

export function ReConfirmEnrollment() {
  const { profileData } = useProfileData()
  const navigate = useNavigate();
  const studentAdmissionId = profileData.refId
  const courseId = profileData.courseId
  const enrollmentCode = profileData.enrollment?.enrollmentCode

  const { data } = useQuery({
    enabled: !!courseId,
    queryKey: ['subjects', courseId],
    queryFn: () => getSubject(courseId),
  })

  const subjects = data?.content ?? []
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([])

  const handleToggleSubject = (subject: { disciplineId: string; disciplineName: string }) => {
    setSelectedSubjects((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (s) => s.disciplineId === subject.disciplineId
      )

      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.disciplineId !== subject.disciplineId)
      } else {
        const mockedFields = {
          semester: '2',
          status: 'IN_PROGRESS',
          finalGrade: 0,
          startDate: '2025-10-10',
          completionDate: '2026-06-30',
          remarks: 'Em andamento',
        }

        return [
          ...prevSelected,
          {
            disciplineId: subject.disciplineId,
            disciplineName: subject.disciplineName,
            ...mockedFields,
          },
        ]
      }
    })
  }

  const handleSubmit = async () => {
    if (!enrollmentCode) {
      toast.error('Código de matrícula não encontrado')
      return
    }

    try {
      const enrollmentData = {
        studentRefId: studentAdmissionId,
        enrollmentId: enrollmentCode,
        academicYear: '2025-2026',
        curriculumYear: '1',
        disciplines: selectedSubjects,
      }
     await addReconfirmEnrollment(enrollmentData)
      const totalAmount = 1600 * selectedSubjects.length
      const dueDate = format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss")

      const referenceData = {
        amount: totalAmount,
        currency: 'AOA',
        description: 'Pagamento reconfirmação matrícula ' + enrollmentCode,
        paymentMethod: 'REF_65e88e95-9d71-4bbb-882a-412fb6a7e111',
        paymentInfo: {
          dueDate: dueDate,
        },
      }
      generateReference(enrollmentCode, referenceData)
      toast.success('Matrícula e referência criadas com sucesso!')
      setSelectedSubjects([])
      navigate("/")
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar a matrícula')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrícula</h1>
          <p className="text-muted-foreground">
            Selecione as disciplinas para a grade curricular
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disciplinas Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject: any) => (
              <div
                key={subject.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedSubjects.some(
                      (s) => s.disciplineId === subject.id
                    )}
                    onCheckedChange={() =>
                      handleToggleSubject({
                        disciplineId: subject.id,
                        disciplineName: subject.name,
                      })
                    }
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <div>
                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="cursor-pointer font-semibold"
                      >
                        {subject.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {subject.abbreviation} • Engenharia Informática
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-muted-foreground" />
                        <span>16000 KZ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-4 w-full"
            disabled={selectedSubjects.length === 0}
            onClick={handleSubmit}
          >
            Adicionar Disciplinas Selecionadas
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
