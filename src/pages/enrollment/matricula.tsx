// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Checkbox } from '@/components/ui/checkbox'
// import { BookOpen, Clock, Users } from 'lucide-react'
// import { useState } from 'react'
// import { toast } from 'sonner'
// import { ScheduleSelectionDialog } from './schedule'

// export const Matricula = () => {
//   const isNewStudent = false // Change this based on actual student status
//   const [selectedSchedules, setSelectedSchedules] = useState<
//     Record<number, string>
//   >({})
//   const [selectedSubjects, setSelectedSubjects] = useState<number[]>([])
//   const currentSubjects = [
//     {
//       id: 1,
//       name: 'Programação Web',
//       code: 'INF301',
//       credits: 6,
//       schedule: 'Seg/Qua 14:00-16:00',
//       professor: 'Dr. António Costa',
//       enrolled: 35,
//       capacity: 40,
//     },
//     {
//       id: 2,
//       name: 'Bases de Dados',
//       code: 'INF302',
//       credits: 6,
//       schedule: 'Ter/Qui 10:00-12:00',
//       professor: 'Dra. Maria Santos',
//       enrolled: 38,
//       capacity: 40,
//     },
//     {
//       id: 3,
//       name: 'Sistemas Operativos',
//       code: 'INF303',
//       credits: 6,
//       schedule: 'Seg/Qua 16:00-18:00',
//       professor: 'Dr. Carlos Mendes',
//       enrolled: 32,
//       capacity: 40,
//     },
//   ]

//   const availableSubjects = [
//     {
//       id: 4,
//       name: 'Redes de Computadores',
//       code: 'INF304',
//       credits: 6,
//       horarios: [
//         {
//           codigo_horario: '6493',
//           nome_horario: 'ENGINFO.5.RC-H1',
//           capacidade: '60',
//           codigo_gradecurricular: '586',
//           nome_gradecurricular: 'Engenharia Informática',
//           codigo_anolectivo: '18',
//           nome_anolectivo: '2022-2023',
//           semestre: '1º Semestre',
//           periodo_turno: 'Diurno',
//           detalhes_aulas: [
//             {
//               designacao: 'Terça-Feira',
//               tipo: 'tp',
//               sala: 'U-104',
//               docente: 'Dr. João Ferreira',
//               hora_inicio: '14:00:00',
//               hora_termino: '15:40:00',
//             },
//             {
//               designacao: 'Quinta-Feira',
//               tipo: 'tp',
//               sala: 'U-104',
//               docente: 'Dr. João Ferreira',
//               hora_inicio: '14:00:00',
//               hora_termino: '15:40:00',
//             },
//           ],
//           disponivel_para_inscricao: '1',
//           status_disponibilidade: 'disponível',
//           observacao: 'Salas atribuidas',
//         },
//         {
//           codigo_horario: '6535',
//           nome_horario: 'ENGINFO.5.RC-H2',
//           capacidade: '60',
//           codigo_gradecurricular: '586',
//           nome_gradecurricular: 'Engenharia Informática',
//           codigo_anolectivo: '18',
//           nome_anolectivo: '2022-2023',
//           semestre: '1º Semestre',
//           periodo_turno: 'Pós-Laboral',
//           detalhes_aulas: [
//             {
//               designacao: 'Segunda-Feira',
//               tipo: 'tp',
//               sala: 'U-103',
//               docente: 'Dr. Pedro Silva',
//               hora_inicio: '10:00:00',
//               hora_termino: '11:40:00',
//             },
//             {
//               designacao: 'Quarta-Feira',
//               tipo: 'tp',
//               sala: 'U-103',
//               docente: 'Dr. Pedro Silva',
//               hora_inicio: '10:00:00',
//               hora_termino: '11:40:00',
//             },
//           ],
//           disponivel_para_inscricao: '1',
//           status_disponibilidade: 'disponível',
//           observacao: 'Salas atribuidas',
//         },
//       ],
//     },
//     {
//       id: 5,
//       name: 'Inteligência Artificial',
//       code: 'INF305',
//       credits: 6,
//       horarios: [
//         {
//           codigo_horario: '6600',
//           nome_horario: 'ENGINFO.5.IA-H1',
//           capacidade: '35',
//           codigo_gradecurricular: '586',
//           nome_gradecurricular: 'Engenharia Informática',
//           codigo_anolectivo: '18',
//           nome_anolectivo: '2022-2023',
//           semestre: '1º Semestre',
//           periodo_turno: 'Diurno',
//           detalhes_aulas: [
//             {
//               designacao: 'Sexta-Feira',
//               tipo: 'tp',
//               sala: 'I-201',
//               docente: 'Dra. Ana Rodrigues',
//               hora_inicio: '08:00:00',
//               hora_termino: '12:00:00',
//             },
//           ],
//           disponivel_para_inscricao: '1',
//           status_disponibilidade: 'disponível',
//           observacao: 'Salas atribuidas',
//         },
//         {
//           codigo_horario: '6601',
//           nome_horario: 'ENGINFO.5.IA-H2',
//           capacidade: '35',
//           codigo_gradecurricular: '586',
//           nome_gradecurricular: 'Engenharia Informática',
//           codigo_anolectivo: '18',
//           nome_anolectivo: '2022-2023',
//           semestre: '1º Semestre',
//           periodo_turno: 'Pós-Laboral',
//           detalhes_aulas: [
//             {
//               designacao: 'Terça-Feira',
//               tipo: 'tp',
//               sala: 'U-105',
//               docente: 'Dr. Luís Costa',
//               hora_inicio: '16:00:00',
//               hora_termino: '18:00:00',
//             },
//             {
//               designacao: 'Quinta-Feira',
//               tipo: 'tp',
//               sala: 'U-105',
//               docente: 'Dr. Luís Costa',
//               hora_inicio: '18:00:00',
//               hora_termino: '20:00:00',
//             },
//           ],
//           disponivel_para_inscricao: '1',
//           status_disponibilidade: 'disponível',
//           observacao: 'Salas atribuidas',
//         },
//         {
//           codigo_horario: '6602',
//           nome_horario: 'ENGINFO.5.IA-H3',
//           capacidade: '35',
//           codigo_gradecurricular: '586',
//           nome_gradecurricular: 'Engenharia Informática',
//           codigo_anolectivo: '18',
//           nome_anolectivo: '2022-2023',
//           semestre: '1º Semestre',
//           periodo_turno: 'Diurno',
//           detalhes_aulas: [
//             {
//               designacao: 'Segunda-Feira',
//               tipo: 'tp',
//               sala: 'I-202',
//               docente: 'Dra. Ana Rodrigues',
//               hora_inicio: '14:00:00',
//               hora_termino: '18:00:00',
//             },
//           ],
//           disponivel_para_inscricao: '1',
//           status_disponibilidade: 'disponível',
//           observacao: 'Salas atribuidas',
//         },
//       ],
//     },
//   ]

//   const handleScheduleChange = (subjectId: number, scheduleId: string) => {
//     setSelectedSchedules((prev) => ({
//       ...prev,
//       [subjectId]: scheduleId,
//     }))
//   }

//   const handleSubjectToggle = (subjectId: number, checked: boolean) => {
//     setSelectedSubjects((prev) =>
//       checked ? [...prev, subjectId] : prev.filter((id) => id !== subjectId),
//     )
//   }

//   const handleAddSubjects = () => {
//     // if (selectedSubjects.length === 0) {
//     //   toast({
//     //     title: 'Nenhuma disciplina selecionada',
//     //     description: 'Selecione pelo menos uma disciplina para adicionar.',
//     //     variant: 'destructive',
//     //   })
//       return
//     }

//     if (!isNewStudent) {
//       const missingSchedules = selectedSubjects.filter(
//         (subjectId) => !selectedSchedules[subjectId],
//       )

//       if (missingSchedules.length > 0) {
//         const missingSubjectNames = availableSubjects
//           .filter((s) => missingSchedules.includes(s.id))
//           .map((s) => s.name)
//           .join(', ')

//         toast.error(
//           `Você deve selecionar um horário para: ${missingSubjectNames}`,
//         )
//         return
//       }
//     }

//     toast.error(
//       `${selectedSubjects.length} disciplina(s) adicionada(s) com sucesso.`,
//     )

//     // Reset selections
//     setSelectedSubjects([])
//     setSelectedSchedules({})
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Matrícula</h1>
//           <p className="text-muted-foreground">
//             Gerencie suas disciplinas e renovação de matrícula
//           </p>
//         </div>
//         <Button size="lg">Renovar Matrícula</Button>
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">
//               Disciplinas Ativas
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{currentSubjects.length}</div>
//             <p className="text-xs text-muted-foreground">Este semestre</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Créditos</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {currentSubjects.reduce((sum, s) => sum + s.credits, 0)}
//             </div>
//             <p className="text-xs text-muted-foreground">De 30 possíveis</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Badge className="bg-success/10 text-success">Matriculado</Badge>
//             <p className="mt-2 text-xs text-muted-foreground">5º Semestre</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Disciplinas Inscritas</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {currentSubjects.map((subject) => (
//               <div key={subject.id} className="rounded-lg border p-4">
//                 <div className="flex items-start justify-between">
//                   <div className="space-y-2">
//                     <div>
//                       <h3 className="font-semibold">{subject.name}</h3>
//                       <p className="text-sm text-muted-foreground">
//                         {subject.code} • {subject.credits} créditos
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-4 text-sm">
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4 text-muted-foreground" />
//                         <span>{subject.schedule}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <BookOpen className="h-4 w-4 text-muted-foreground" />
//                         <span>{subject.professor}</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Users className="h-4 w-4 text-muted-foreground" />
//                         <span>
//                           {subject.enrolled}/{subject.capacity} alunos
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <Badge variant="outline">Inscrito</Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Disciplinas Disponíveis</CardTitle>
//             <Badge variant="outline">
//               {isNewStudent ? 'Aluno Novo' : 'Aluno Antigo'}
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {availableSubjects.map((subject) => (
//               <div key={subject.id} className="rounded-lg border p-4 space-y-4">
//                 <div className="flex items-start gap-3">
//                   <Checkbox
//                     id={`subject-${subject.id}`}
//                     className="mt-1"
//                     checked={selectedSubjects.includes(subject.id)}
//                     onCheckedChange={(checked) =>
//                       handleSubjectToggle(subject.id, checked as boolean)
//                     }
//                   />
//                   <div className="flex-1 space-y-3">
//                     <div>
//                       <label
//                         htmlFor={`subject-${subject.id}`}
//                         className="cursor-pointer font-semibold"
//                       >
//                         {subject.name}
//                       </label>
//                       <p className="text-sm text-muted-foreground">
//                         {subject.code} • {subject.credits} créditos
//                       </p>
//                     </div>

//                     {!isNewStudent && (
//                       <div className="space-y-2">
//                         <p className="text-sm font-medium">
//                           Selecionar Horário (Obrigatório)
//                         </p>
//                         <ScheduleSelectionDialog
//                           horarios={subject.horarios}
//                           selectedScheduleId={selectedSchedules[subject.id]}
//                           onSelectSchedule={(scheduleId) =>
//                             handleScheduleChange(subject.id, scheduleId)
//                           }
//                           subjectName={subject.name}
//                         />
//                       </div>
//                     )}

//                     {isNewStudent && (
//                       <div className="space-y-2">
//                         <p className="text-sm font-medium">
//                           Horários Disponíveis:
//                         </p>
//                         <div className="text-sm text-muted-foreground">
//                           {subject.horarios.length} horário(s) disponível(is)
//                         </div>
//                         <ScheduleSelectionDialog
//                           horarios={subject.horarios}
//                           selectedScheduleId={undefined}
//                           onSelectSchedule={() => {}}
//                           subjectName={subject.name}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <Button className="mt-4 w-full" onClick={handleAddSubjects}>
//             Adicionar Disciplinas Selecionadas
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
