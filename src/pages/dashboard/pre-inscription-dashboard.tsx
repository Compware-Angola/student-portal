import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, BookOpen, AlertCircle, Wallet, DollarSign, GraduationCap, Bell, CalendarDays, FileText, Download, BookMarked, ScrollText, Info, Sparkles, GraduationCap as GradCap, CheckCircle2, ArrowRight, Hourglass, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PreIncriptionDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024/2025");
  const navigate = useNavigate();

  const studentData = {
    name: "João Silva",
    // Estado do estudante:
    // "pre-inscrito" - ainda não fez exame de admissão
    // "aguardando-resultado" - já fez o exame, aguarda resultados
    // "admitido" - aprovado no exame, pode fazer matrícula
    // "reprovado" - não foi admitido
    // "matriculado" - estudante regular
    status: "pre-inscrito" as
      | "pre-inscrito"
      | "aguardando-resultado"
      | "admitido"
      | "reprovado"
      | "matriculado",
    courses: [
      { id: 1, name: "Engenharia Informática", semester: "5º Semestre" },
      { id: 2, name: "Gestão de Sistemas de Informação", semester: "3º Semestre" }
    ],
    currentCourse: "Engenharia Informática",
    semester: "5º Semestre",
    averageGrade: 15.7,
    attendance: 92,
    muteuCashBalance: 12500.00,
    pendingDebt: 45000.00,
    completedSubjects: 24,
    totalSubjects: 30,
    nextClass: {
      subject: "Programação Web",
      time: "14:00",
      room: "Lab 3",
    },
    pendingTasks: 3,
  };

  const messages = [
    {
      id: 1,
      type: "exam",
      title: "Prova de Programação Web",
      description: "A prova será realizada no dia 15/11/2024 às 14:00 no Lab 3",
      date: "2024-11-10",
      priority: "high"
    },
    {
      id: 2,
      type: "grade",
      title: "Notas Publicadas - Sistemas Operativos",
      description: "As notas da avaliação contínua foram publicadas",
      date: "2024-11-08",
      priority: "medium"
    },
    {
      id: 3,
      type: "announcement",
      title: "Recesso Acadêmico",
      description: "Informamos que haverá recesso de 20/12 a 05/01",
      date: "2024-11-05",
      priority: "low"
    }
  ];

  const academicEvents = [
    { id: 1, title: "Início do 2º Semestre", date: "2025-02-01", type: "semester" },
    { id: 2, title: "Período de Matrícula", date: "2025-01-15", type: "enrollment" },
    { id: 3, title: "Entrega de Projetos Finais", date: "2024-12-20", type: "deadline" }
  ];

  const examCalendar = [
    { id: 1, subject: "Programação Web", date: "2024-11-15", time: "14:00", room: "Lab 3" },
    { id: 2, subject: "Sistemas Operativos", date: "2024-11-18", time: "10:00", room: "U-201" },
    { id: 3, subject: "Redes de Computadores", date: "2024-11-22", time: "16:00", room: "I-105" }
  ];

  const academicYears = [
    "2022/2023",
    "2023/2024",
    "2024/2025",
  ];

  const curriculum = {
    "2024/2025": [
      { code: "EI501", name: "Programação Web", credits: 6, semester: "1º Semestre", status: "Em Curso", grade: "-" },
      { code: "EI502", name: "Sistemas Operativos", credits: 6, semester: "1º Semestre", status: "Em Curso", grade: "-" },
      { code: "EI503", name: "Redes de Computadores", credits: 6, semester: "1º Semestre", status: "Em Curso", grade: "-" },
      { code: "EI504", name: "Inteligência Artificial", credits: 6, semester: "2º Semestre", status: "Não Iniciado", grade: "-" },
      { code: "EI505", name: "Segurança Informática", credits: 6, semester: "2º Semestre", status: "Não Iniciado", grade: "-" },
    ],
    "2023/2024": [
      { code: "EI401", name: "Bases de Dados", credits: 6, semester: "1º Semestre", status: "Concluído", grade: "16" },
      { code: "EI402", name: "Engenharia de Software", credits: 6, semester: "1º Semestre", status: "Concluído", grade: "15" },
      { code: "EI403", name: "Estruturas de Dados", credits: 6, semester: "2º Semestre", status: "Concluído", grade: "17" },
      { code: "EI404", name: "Arquitetura de Computadores", credits: 6, semester: "2º Semestre", status: "Concluído", grade: "14" },
    ],
    "2022/2023": [
      { code: "EI301", name: "Programação Orientada a Objetos", credits: 6, semester: "1º Semestre", status: "Concluído", grade: "15" },
      { code: "EI302", name: "Algoritmos e Complexidade", credits: 6, semester: "1º Semestre", status: "Concluído", grade: "16" },
      { code: "EI303", name: "Sistemas Digitais", credits: 6, semester: "2º Semestre", status: "Concluído", grade: "14" },
      { code: "EI304", name: "Matemática Discreta", credits: 6, semester: "2º Semestre", status: "Concluído", grade: "13" },
    ],
  };

  const documentosPreInscricao = [
    {
      id: 1,
      title: "Tópicos do Exame de Admissão",
      description: "Conteúdos programáticos a estudar para o exame.",
      icon: BookMarked,
      file: "topicos-exame.pdf",
      tag: "Essencial",
    },
    {
      id: 2,
      title: "Manual de Pagamentos",
      description: "Guia completo sobre como efectuar os pagamentos.",
      icon: Wallet,
      file: "manual-pagamentos.pdf",
      tag: "Financeiro",
    },
    {
      id: 3,
      title: "Regulamento dos Exames",
      description: "Normas e procedimentos para o exame de admissão.",
      icon: ScrollText,
      file: "regulamento-exames.pdf",
      tag: "Regras",
    },
    {
      id: 4,
      title: "Regulamento Académico",
      description: "Regulamento geral da vida académica.",
      icon: FileText,
      file: "regulamento-academico.pdf",
      tag: "Oficial",
    },
    {
      id: 5,
      title: "Guia do Candidato",
      description: "Informações essenciais para novos candidatos.",
      icon: Info,
      file: "guia-candidato.pdf",
      tag: "Recomendado",
    },
    {
      id: 6,
      title: "Calendário do Exame",
      description: "Datas, horários e locais do exame de admissão.",
      icon: CalendarDays,
      file: "calendario-exame.pdf",
      tag: "Importante",
    },
  ];

  const handleDownload = (fileName: string) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = fileName;
    link.click();
  };

  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {studentData.name}
          </h1>
          <p className="text-muted-foreground">
            {studentData.status === "pre-inscrito"
              ? "Candidato pré-inscrito - Aguardando exame de admissão"
              : studentData.status === "aguardando-resultado"
              ? "Exame realizado - Aguardando publicação dos resultados"
              : studentData.status === "admitido"
              ? "Parabéns! Você foi admitido"
              : studentData.status === "reprovado"
              ? "Resultado do exame de admissão"
              : `${studentData.currentCourse} - ${studentData.semester}`}
          </p>
        </div>

        {studentData.status === "aguardando-resultado" ||
        studentData.status === "admitido" ||
        studentData.status === "reprovado" ? (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Aguardando resultados */}
            <Card
              className={
                studentData.status === "aguardando-resultado"
                  ? "border-l-4 border-l-amber-500 ring-1 ring-amber-500/20"
                  : "opacity-60"
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-amber-500/10">
                    <Hourglass className="h-5 w-5 text-amber-600" />
                  </div>
                  {studentData.status === "aguardando-resultado" && (
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white">Atual</Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">Aguardando Resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Os resultados do seu exame de admissão ainda estão a ser processados. Por favor, aguarde a publicação oficial.
                </p>
              </CardContent>
            </Card>

            {/* Admitido */}
            <Card
              className={
                studentData.status === "admitido"
                  ? "border-l-4 border-l-success ring-1 ring-success/20"
                  : "opacity-60"
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  {studentData.status === "admitido" && (
                    <Badge className="bg-success hover:bg-success text-white">Aprovado</Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">Admitido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Parabéns! Você foi aprovado no exame de admissão. Avance para a matrícula para garantir a sua vaga.
                </p>
                {studentData.status === "admitido" && (
                  <Button
                    onClick={() => navigate("/matricula")}
                    className="w-full gap-1.5"
                  >
                    Fazer Matrícula
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Reprovado */}
            <Card
              className={
                studentData.status === "reprovado"
                  ? "border-l-4 border-l-destructive ring-1 ring-destructive/20"
                  : "opacity-60"
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  {studentData.status === "reprovado" && (
                    <Badge variant="destructive">Não admitido</Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">Reprovado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Infelizmente não obteve a classificação necessária. Consulte os serviços académicos para mais informações sobre próximas oportunidades.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : studentData.status === "pre-inscrito" ? (
          <>
            {/* HERO - sóbrio e profissional */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                  <GradCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Pré-inscrição confirmada
                    </Badge>
                  </div>
                  <h2 className="text-xl font-semibold mb-1">
                    Prepare-se para o seu exame de admissão
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Reunimos os documentos essenciais para a sua preparação. Faça o download e estude com atenção.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* DOCS GRID */}
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Documentos Importantes
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Materiais oficiais para preparar o seu exame de admissão.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documentosPreInscricao.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <Card
                      key={doc.id}
                      className="group hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="p-2.5 rounded-lg bg-muted">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                            {doc.tag}
                          </Badge>
                        </div>
                        <CardTitle className="text-base mt-3 leading-snug">
                          {doc.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </div>
                          <Button
                            onClick={() => handleDownload(doc.file)}
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                          >
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
        {studentData.courses.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Meus Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {studentData.courses.map((course) => (
                  <Button
                    key={course.id}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left"
                  >
                    <div>
                      <div className="font-semibold">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.semester}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.averageGrade}</div>
              <p className="text-xs text-muted-foreground">Em 20 valores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.attendance}%</div>
              <Progress value={studentData.attendance} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MUTEU Cash</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.muteuCashBalance.toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN'
                })}
              </div>
              <p className="text-xs text-muted-foreground">Saldo atual</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => navigate('/financas')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dívida Pendente</CardTitle>
              <DollarSign className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {studentData.pendingDebt.toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN'
                })}
              </div>
              <p className="text-xs text-muted-foreground">Clique para ver detalhes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disciplinas Concluídas</CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.completedSubjects}/{studentData.totalSubjects}
              </div>
              <Progress
                value={(studentData.completedSubjects / studentData.totalSubjects) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Mensagens e Comunicados
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{message.title}</h4>
                        <Badge
                          variant={
                            message.priority === "high"
                              ? "destructive"
                              : message.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.type === "exam" ? "Prova" : message.type === "grade" ? "Nota" : "Comunicado"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{message.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.date).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Calendário Acadêmico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {academicEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-lg border"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('pt-PT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Calendário de Provas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examCalendar.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{exam.subject}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString('pt-PT')} às {exam.time}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {exam.room}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grade Curricular</CardTitle>
            <div className="mt-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o ano letivo" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {curriculum[selectedYear as keyof typeof curriculum]?.map((subject) => (
                  <TableRow key={subject.code}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.credits}</TableCell>
                    <TableCell>{subject.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subject.status === "Concluído"
                            ? "default"
                            : subject.status === "Em Curso"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {subject.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{subject.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          </>
        )}
      </div>

  );
};

export default PreIncriptionDashboard;