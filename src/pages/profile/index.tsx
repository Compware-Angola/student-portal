import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react'

export function Profile() {
  const studentInfo = {
    name: 'João Silva',
    studentId: '20240123',
    email: 'joao.silva@uma.ao',
    phone: '+244 923 456 789',
    address: 'Luanda, Angola',
    birthDate: '15/03/2002',
    course: 'Engenharia Informática',
    semester: '5º Semestre',
    enrollmentDate: '2022-02-01',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl">JS</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="font-semibold">{studentInfo.name}</h3>
              <p className="text-sm text-muted-foreground">
                Nº {studentInfo.studentId}
              </p>
              <p className="text-sm text-muted-foreground">
                {studentInfo.course}
              </p>
            </div>
            <Button className="w-full" variant="outline">
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                <TabsTrigger value="academic">Dados Acadêmicos</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input id="name" value={studentInfo.name} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={studentInfo.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input id="phone" value={studentInfo.phone} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birth">Data de Nascimento</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input id="birth" value={studentInfo.birthDate} />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input id="address" value={studentInfo.address} />
                    </div>
                  </div>
                </div>
                <Button className="w-full">Salvar Alterações</Button>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Número de Estudante</Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-id"
                        value={studentInfo.studentId}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Curso</Label>
                    <Input id="course" value={studentInfo.course} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre Atual</Label>
                    <Input
                      id="semester"
                      value={studentInfo.semester}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollment">Data de Matrícula</Label>
                    <Input
                      id="enrollment"
                      value={new Date(
                        studentInfo.enrollmentDate,
                      ).toLocaleDateString('pt-AO')}
                      disabled
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Histórico Acadêmico</p>
                  <p className="text-xs text-muted-foreground">
                    Última atualização: 10/01/2025
                  </p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Certificado de Matrícula</p>
                  <p className="text-xs text-muted-foreground">
                    Ano letivo 2024/2025
                  </p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Comprovante de Pagamento</p>
                  <p className="text-xs text-muted-foreground">
                    Fevereiro 2025
                  </p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Declaração de Frequência</p>
                  <p className="text-xs text-muted-foreground">
                    Última emissão: 05/02/2025
                  </p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
