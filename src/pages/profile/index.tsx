import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileAvatar } from './components/profile-avatar'
import { ProfileInfo } from './components/profile-info'
import { InfoTab } from './components/info-tab'

import { InputWithLabel } from './components/input-with-label'

export function Profile() {
  const [profileData] = useState({
    nomeCompleto: 'Domingos Canhanga',
    email: 'domingos.canhanga@email.com',
    telefone: '+244 923 456 789',
    curso: 'Direito',
    anoAcademico: '2025-2026',
    matricula: '68e6335f1fdf4446c5268005',
    status: 'Ativo',
  })

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        <Card>
          <CardContent className="">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <ProfileAvatar
                name={profileData.nomeCompleto}
                status={profileData.status}
              />
              <ProfileInfo {...profileData} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="academic">Dados Académicos</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <InfoTab
              title="Informações Pessoais"
              description="Gerencie suas informações pessoais"
            >
              <InputWithLabel
                label="Nome Completo"
                value={profileData.nomeCompleto}
              />
              <InputWithLabel
                label="Número de Matrícula"
                value={profileData.matricula}
              />
            </InfoTab>
          </TabsContent>

          <TabsContent value="academic" className="mt-6">
            <InfoTab
              title="Dados Académicos"
              description="Informações sobre seu curso e matrícula"
            >
              <InputWithLabel label="Curso" value={profileData.curso} />
              <InputWithLabel
                label="Ano Académico"
                value={profileData.anoAcademico}
              />
              <InputWithLabel label="Status" value={profileData.status} />
            </InfoTab>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <InfoTab
              title="Informações de Contacto"
              description="Gerencie suas formas de contacto"
            >
              <InputWithLabel label="Email" value={profileData.email} />
              <InputWithLabel label="Telefone" value={profileData.telefone} />
            </InfoTab>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
