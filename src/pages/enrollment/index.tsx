import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LibraryBig } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getEnrollmentsWithFilters } from '@/services/enrollment.service'
import { useProfileData } from '@/hooks/use-profile-data'
import {
  ItemMedia,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { type Enrollment } from '@/services/enrollment.service'
import { useNavigate } from 'react-router-dom'
export function Enrollment() {
  const { profileData } = useProfileData()
  const navigate = useNavigate()
  const studentAdmissionId = profileData.refId
  console.log('####', studentAdmissionId)
  const { data } = useQuery({
    queryKey: ['enrollment-ref', studentAdmissionId],
    queryFn: () =>
      getEnrollmentsWithFilters({
        studentAdmissionId,
      }),
  })
  const enrollment = data?.content
  const isNewStudent = (enrollment: Enrollment[] | undefined) => {
    if (enrollment && enrollment.length == 0) return true
    return false
  }

  const currentSubjects = [
    {
      id: 1,
      name: 'Programação Web',
      code: 'INF301',
      credits: 6,
      schedule: 'Seg/Qua 14:00-16:00',
      professor: 'Dr. António Costa',
      enrolled: 35,
      capacity: 40,
    },
    {
      id: 2,
      name: 'Bases de Dados',
      code: 'INF302',
      credits: 6,
      schedule: 'Ter/Qui 10:00-12:00',
      professor: 'Dra. Maria Santos',
      enrolled: 38,
      capacity: 40,
    },
    {
      id: 3,
      name: 'Sistemas Operativos',
      code: 'INF303',
      credits: 6,
      schedule: 'Seg/Qua 16:00-18:00',
      professor: 'Dr. Carlos Mendes',
      enrolled: 32,
      capacity: 40,
    },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrícula</h1>
          <p className="text-muted-foreground">
            Gerencie suas disciplinas e renovação de matrícula
          </p>
        </div>
        <Button size="lg">Renovar Matrícula</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Disciplinas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSubjects.length}</div>
            <p className="text-xs text-muted-foreground">Este semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Créditos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSubjects.reduce((sum, s) => sum + s.credits, 0)}
            </div>
            <p className="text-xs text-muted-foreground">De 30 possíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-success/10 text-success">Matriculado</Badge>
            <p className="mt-2 text-xs text-muted-foreground">5º Semestre</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matricula Disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isNewStudent(enrollment) && (
              <div className="flex w-full flex-col gap-6 mt-2">
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <LibraryBig />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Matrícula 2020 - SEMESTRE I</ItemTitle>
                    <ItemDescription>Direito</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/confirmar-matricula')}
                    >
                      Matricular
                    </Button>
                  </ItemActions>
                </Item>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
