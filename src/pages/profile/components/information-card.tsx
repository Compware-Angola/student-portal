import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalDataTab } from './personal-data-tab'
import { AcademicDataTab } from './academic-data-tab'

type InformationCardProps = {
  email?: string
  phone?: string
  dateOfBirth: string
  address?: string
  name: string

  studentId?: string | number | null | undefined
  course?: string | null | undefined
  semester?: string | number | null | undefined
  enrollmentDate?: string | null | undefined
}


export function InformationCard({
  email,
  phone,
  dateOfBirth,
  address,
  name,
  studentId,
  course,
  semester,
  enrollmentDate,
  
}: InformationCardProps) {
  return (
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
          <PersonalDataTab
            name={name}
            email={email ?? ''}
            phone={phone ?? ''}
            dateOfBirth={dateOfBirth}
            address={address ?? ''}
          />
          <AcademicDataTab
            studentId={studentId}
            course={course}
            semester={semester}
            enrollmentDate={enrollmentDate}
          />

        </Tabs>
      </CardContent>
    </Card>
  )
}
