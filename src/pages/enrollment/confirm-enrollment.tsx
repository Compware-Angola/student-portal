import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Checkbox } from '@/components/ui/checkbox'
import { getSubject, type Subject } from '@/services/subject.service'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Banknote, BookMarked, Calendar } from 'lucide-react'
import { useProfileData } from '@/hooks/use-profile-data'
import { toast } from 'sonner'
import { addEnrollment } from '@/services/enrollment.service'
import { generateReference } from '@/services/financial.service'
import { addDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'

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

  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    if (data?.content) {
      setSubjects(data.content)
    }
  }, [data])
  const handleSelectSubject = async () => {
    setSelectedSubjects(subjects)
    setSubjects([])
  }
  const handleSubmit = async () => {
    try {
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
      await generateReference(enrollmentCode, referenceData)
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
                    checked={true}
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
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <span>16000KZ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                        <span>2 Ano</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Semestre II</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            disabled={selectedSubjects.length > 0}
            className="mt-4 w-full"
            onClick={handleSelectSubject}
          >
            Matricular
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Disciplinas Selecionadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedSubjects.map((subject) => (
              <div className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <Checkbox disabled checked={true} className="mt-1" />
                  <div className="space-y-2">
                    <div>
                      <label className="cursor-pointer font-semibold">
                        {subject.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        EDR • Engenharia Informática
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <span>16000KZ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                        <span>2 Ano</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Semestre II</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex">
                  <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    <p className="text-sm"> Pendente</p>
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-2 justify-end mt-12">
            <Button variant="secondary">Cancelar</Button>
            <Button disabled>
              <Spinner />
              Gerar Referência
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
