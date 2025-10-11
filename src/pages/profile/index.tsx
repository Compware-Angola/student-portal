import { Skeleton } from '@/components/ui/skeleton'
import { useProfileData } from '@/hooks/use-profile-data'
import { ProfileCardSkeleton } from './components/profile-card-skeleton'
import { InformationCard } from './components/information-card'
import { ProfileAvatar } from './components/profile-avatar'
import { InfoCardSkeleton } from './components/info-card-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export function Profile() {
  const { profileData, isLoading } = useProfileData()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <ProfileCardSkeleton />
          <InfoCardSkeleton />
        </div>
      </div>
    )
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    fullName,
    address,
    dateOfBirth,
    curriculumYear,
  } = profileData

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          curriculumYear={curriculumYear}
        />
        <InformationCard
          name={fullName}
          email={email}
          phone={phone}
          dateOfBirth={dateOfBirth}
          address={address}
        />
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
