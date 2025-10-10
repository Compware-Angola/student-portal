import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { BookOpen, Clock, Users } from 'lucide-react'

export function Enrollment() {
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

  const availableSubjects = [
    {
      id: 4,
      name: 'Redes de Computadores',
      code: 'INF304',
      credits: 6,
      schedule: 'Ter/Qui 14:00-16:00',
      professor: 'Dr. João Ferreira',
      enrolled: 28,
      capacity: 40,
    },
    {
      id: 5,
      name: 'Inteligência Artificial',
      code: 'INF305',
      credits: 6,
      schedule: 'Sex 08:00-12:00',
      professor: 'Dra. Ana Rodrigues',
      enrolled: 30,
      capacity: 35,
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
          <CardTitle>Disciplinas Inscritas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSubjects.map((subject) => (
              <div key={subject.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subject.code} • {subject.credits} créditos
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{subject.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{subject.professor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subject.enrolled}/{subject.capacity} alunos
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Inscrito</Badge>
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
            {availableSubjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-start justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-3">
                  <Checkbox id={`subject-${subject.id}`} className="mt-1" />
                  <div className="space-y-2">
                    <div>
                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="cursor-pointer font-semibold"
                      >
                        {subject.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {subject.code} • {subject.credits} créditos
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{subject.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{subject.professor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subject.enrolled}/{subject.capacity} alunos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full">
            Adicionar Disciplinas Selecionadas
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
