import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { getSubject } from '@/services/subject.service'
import { useQuery } from '@tanstack/react-query'
import { Coins } from 'lucide-react'
import { useProfileData } from '@/hooks/use-profile-data'
import { toast } from 'sonner'
import { addEnrollment } from '@/services/enrollment.service'
import { generateReference } from '@/services/financial.service'
import { addDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

interface SelectedSubject {
  id: string
  name: string
}

export function ConfirmEnrollment() {
  const { profileData } = useProfileData()
  const navigate = useNavigate()
  const studentAdmissionId = profileData?.refId
  const courseId = profileData?.courseId

  const { data } = useQuery({
    enabled: !!courseId,
    queryKey: ['subjects', courseId],
    queryFn: () => {
      if (courseId) {
        return getSubject(courseId)
      }
    },
  })

  const subjects = data?.content ?? []
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    [],
  )

  const handleToggleSubject = (subject: { id: string; name: string }) => {
    setSelectedSubjects((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === subject.id)
      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.id !== subject.id)
      } else {
        return [...prevSelected, { id: subject.id, name: subject.name }]
      }
    })
  }

  const handleSubmit = async () => {
    console.log('Disciplinas selecionadas:', selectedSubjects)
    try {
      console.log('####', studentAdmissionId)
      const enrollmentData = {
        studentAdmissionId: studentAdmissionId,
        courseId: courseId,
        courseName: 'Computer Engineering',
        studentNumber: studentAdmissionId,
        enrollmentStatus: 'ACTIVE_REGULAR',
        enrollmentDate: '2025-09-01',
        academicYear: '2025-2026',
        semester: 'Semester I',
        disciplines: selectedSubjects,
      }
      const amount = 1600 * selectedSubjects.length
      const dueDate = format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss")
      const referenceData = {
        amount: amount,
        currency: 'AOA',
        description: 'Teste Mutue 08072025',
        paymentMethod: 'REF_65e88e95-9d71-4bbb-882a-412fb6a7e111',
        paymentInfo: {
          dueDate: dueDate,
        },
      }

      const enrollmentResponse = await addEnrollment(enrollmentData)
      const enrollmentCode = enrollmentResponse.enrollmentCode
      const referenceResponse = await generateReference(
        enrollmentCode,
        referenceData,
      )
      console.log('enrollment:', enrollmentResponse)
      console.log('reference:', referenceResponse)
      navigate('/')
    } catch (error: any) {
      console.log(error)
      toast.error('Erro ao cadastrar a matricula')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrícula</h1>
          <p className="text-muted-foreground">
            Seleciona as Disciplinas para a grade curricular
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disciplinas Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedSubjects.some((s) => s.id === subject.id)}
                    onCheckedChange={() =>
                      handleToggleSubject({
                        id: subject.id,
                        name: subject.name,
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
                        <span>16000KZ</span>
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
