import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalDataTab } from './personal-data-tab'
import { AcademicDataTab } from './academic-data-tab'
type InformationCardProps = {
  email: string
  phone: string
  dateOfBirth: string
  address: string
  name: string
}

export function InformationCard({
  email,
  phone,
  dateOfBirth,
  address,
  name,
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
            email={email}
            phone={phone}
            dateOfBirth={dateOfBirth}
            address={address}
          />
          <AcademicDataTab />
        </Tabs>
      </CardContent>
    </Card>
  )
}
