import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { CheckCircle2Icon, LibraryBig } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getEnrollments } from '@/services/auth.service'
import type { IEnrollment } from './types/enrollment'
import { getAllAvaliableEnrollments, getAllHIstoricEnrollments } from '@/utils'
import { useNavigate } from 'react-router-dom'

export function Enrollment() {
  const navigate = useNavigate()
  const handleMatricular = () => {
    navigate(`/confirmar-matricula`)
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getEnrollments('1234'),
  })

  if (isError) {
    console.error('Erro ao buscar matrículas:', error)
  }
  if (!isError && data) {
  }

  if (isLoading) {
    return <p>Carregando matrículas...</p>
  }
  const filteredActiveRegularEnrollments = getAllAvaliableEnrollments(
    data?.content ?? [],
  )
  const filteredHistoricEnrollments = getAllHIstoricEnrollments(
    data?.content ?? [],
  )
  return (
    <>
      <>
        {filteredActiveRegularEnrollments.length > 0 ? (
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Lista de Matrículas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredActiveRegularEnrollments.map(
                (enrollment: IEnrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex w-full flex-col gap-6 mt-2"
                  >
                    <Item variant="outline">
                      <ItemMedia variant="icon">
                        <LibraryBig />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          Matrícula {enrollment.academicYear} -{' '}
                          {enrollment.semester}
                        </ItemTitle>
                        <ItemDescription>
                          {enrollment.courseName}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" variant="outline" onClick={()=> handleMatricular()} >
                          Matricular
                        </Button>
                      </ItemActions>
                    </Item>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4">
            <Alert variant="info">
              <CheckCircle2Icon />
              <AlertTitle>Matrícula on-line</AlertTitle>
              <AlertDescription>
                Rematrícula não disponível. Favor entrar em contato com a
                Secretária
              </AlertDescription>
            </Alert>
          </div>
        )}
      </>

      <div>
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle>Lista de Matrículas</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredHistoricEnrollments.length > 0 ? (
              filteredActiveRegularEnrollments.map(
                (enrollment: IEnrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex w-full flex-col gap-6 mt-2"
                  >
                    <Item variant="outline">
                      <ItemMedia variant="icon">
                        <LibraryBig />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          Matrícula {enrollment.academicYear} -{' '}
                          {enrollment.semester}
                        </ItemTitle>
                        <ItemDescription>
                          {enrollment.courseName}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button size="sm" variant="outline">
                          Ver Mais
                        </Button>
                      </ItemActions>
                    </Item>
                  </div>
                ),
              )
            ) : (
              <p>Nenhuma matrícula encontrada.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
