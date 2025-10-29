import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Schedule() {
  // Mock data para horário
  const schedule = [
    {
      day: 'Segunda-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Matemática I',
          room: 'Sala 201',
          professor: 'Prof. Silva',
        },
        {
          time: '10:30 - 12:30',
          subject: 'Programação',
          room: 'Lab 1',
          professor: 'Prof. Costa',
        },
      ],
    },
    {
      day: 'Terça-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Física',
          room: 'Sala 105',
          professor: 'Prof. Santos',
        },
        {
          time: '14:00 - 16:00',
          subject: 'Química',
          room: 'Lab 3',
          professor: 'Prof. Oliveira',
        },
      ],
    },
    {
      day: 'Quarta-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Inglês',
          room: 'Sala 302',
          professor: 'Prof. Ferreira',
        },
        {
          time: '10:30 - 12:30',
          subject: 'Base de Dados',
          room: 'Lab 2',
          professor: 'Prof. Pereira',
        },
      ],
    },
    {
      day: 'Quinta-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Estatística',
          room: 'Sala 204',
          professor: 'Prof. Almeida',
        },
        {
          time: '14:00 - 16:00',
          subject: 'Algoritmos',
          room: 'Lab 1',
          professor: 'Prof. Rodrigues',
        },
      ],
    },
    {
      day: 'Sexta-feira',
      classes: [
        {
          time: '08:00 - 10:00',
          subject: 'Sistemas Operativos',
          room: 'Lab 4',
          professor: 'Prof. Martins',
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Horário</h1>
      </div>

      <div className="grid gap-4">
        {schedule.map((daySchedule) => (
          <Card key={daySchedule.day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{daySchedule.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {daySchedule.classes.map((classInfo, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 font-medium text-sm text-muted-foreground min-w-[120px]">
                      {classInfo.time}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold">{classInfo.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {classInfo.room} • {classInfo.professor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
