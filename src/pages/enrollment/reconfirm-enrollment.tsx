import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { getSubject, type Subject } from '@/services/subject.service'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Banknote,
  BookMarked,
  Calendar,
  Coins,
} from 'lucide-react'
import { useProfileData } from '@/hooks/use-profile-data'
import { toast } from 'sonner'
import { addReconfirmEnrollment } from '@/services/enrollment.service'
import { generateReference } from '@/services/financial.service'
import { addDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

export function ReConfirmEnrollment() {
  const { profileData } = useProfileData()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [pendentSubjects, setPendentSubjects] = useState<Subject[]>([])
  const [selectedPendentSubjects, setSelectedPendentSubjects] = useState<
    Subject[]
  >([])
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])

  const navigate = useNavigate()
  const studentAdmissionId = profileData?.refId
  const courseId = profileData?.courseId
  const enrollmentCode = profileData?.enrollment?.enrollmentCode

  const { data } = useQuery({
    enabled: !!courseId,
    queryKey: ['subjects', courseId],
    queryFn: () => {
      if (!courseId) return
      return getSubject(courseId)
    },
  })
  useEffect(() => {
    if (data?.content) {
      setPendentSubjects(data.content) //Para teste
      setSubjects(data.content)
    }
  }, [data])

  const handleTogglePendentSubject = (subject: Subject) => {
    setSelectedPendentSubjects((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === subject.id)
      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.id !== subject.id)
      } else {
        return [...prevSelected, subject]
      }
    })
  }

  const handleToggleSubject = (subject: Subject) => {
    setSelectedSubjects((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === subject.id)
      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.id !== subject.id)
      } else {
        return [...prevSelected, subject]
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
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao cadastrar a matrícula')
    }
  }
  const shouldSelectAvailableSubjects =
    pendentSubjects.length == selectedPendentSubjects.length
  const shouldAllowSubjectEnrollment =
    selectedPendentSubjects.length > 0 || selectedSubjects.length > 0
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reconfirmar Matrícula
          </h1>
          <p className="text-muted-foreground">
            Selecione as disciplinas para a grade curricular
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Disciplinas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendentSubjects.map((subject: any) => (
              <div
                key={subject.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedPendentSubjects.some(
                      (s) => s.id === subject.id,
                    )}
                    onCheckedChange={() => handleTogglePendentSubject(subject)}
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
                        <span>16000 KZ</span>
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
        </CardContent>
      </Card>
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
                    disabled={!shouldSelectAvailableSubjects}
                    checked={selectedSubjects.some((s) => s.id === subject.id)}
                    onCheckedChange={() => handleToggleSubject(subject)}
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
                        <span>16000 KZ</span>
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
            className="mt-4 w-full"
            disabled={!shouldAllowSubjectEnrollment}
            onClick={handleSubmit}
          >
            Adicionar Disciplinas Selecionadas
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
