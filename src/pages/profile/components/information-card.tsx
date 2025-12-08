import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalDataTab } from './personal-data-tab'
import { AcademicDataTab } from './academic-data-tab'
import { SecurityDataTab } from './security-data-tab'


type InformationCardProps = {
  email?: string
  phone?: string
  documento: string
  address?: string
  name: string

  studentId?: string | number | null | undefined
  course?: string | null | undefined
  semester?: string | number | null | undefined
  enrollmentDate?: string | null | undefined

  // Campos da aba de segurança
  lastLogin?: string | null
  twoFactorEnabled?: boolean
  updatedAt?: string | null
  isEditing:boolean
  userId:string
}

export function InformationCard({
  email,
  phone,
  documento,
  address,
  name,
  studentId,
  course,
  semester,
  enrollmentDate,
  userId,


  isEditing,
}: InformationCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          
          {/* ---- TABS ---- */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="academic">Dados Acadêmicos</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger> {/* NOVO */}
          </TabsList>

          {/* ---- CONTEÚDO DAS TABS ---- */}
          <PersonalDataTab
            name={name}
            email={email ?? ''}
            phone={phone ?? ''}
            documento={documento}
            address={address ?? ''}
            isEditing ={isEditing}
            userId={userId}
          />

          <AcademicDataTab
            studentId={studentId}
            course={course}
            semester={semester}
            enrollmentDate={enrollmentDate}
          />

          {/* ---- SEGURANÇA ---- */}
          <SecurityDataTab
            
            
             isEditing ={isEditing}
             userId={userId}
          />

        </Tabs>
      </CardContent>
    </Card>
  )
}
