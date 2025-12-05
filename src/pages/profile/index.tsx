import { Skeleton } from '@/components/ui/skeleton'
import { ProfileCardSkeleton } from './components/profile-card-skeleton'
import { InformationCard } from './components/information-card'
import { ProfileAvatar } from './components/profile-avatar'
import { InfoCardSkeleton } from './components/info-card-skeleton'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { useState } from 'react'

export function Profile() {
  const {
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    profileData,
  } = useQueryProfile()
 const [isEditing, setIsEditing] = useState(false);

  if (isProfileLoading || isProfileError || !profileData) {
    if (profileError) {
      toast.error(profileError.message)
    }
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
    birthDate,
    enrollmentState,
    firstName,
    fullName,
    lastName,
    email,
    phone,
    address,
    curso,
    polo,
    codigo_matricula,
    userId
    
    
  } = profileData


  return (
    <div className="space-y-6">
         <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">Gerencie as suas informações</p>
        </div>
      
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar Dados"}
        </Button>
        
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileAvatar
          firstName={firstName}
          lastName={lastName}
          enrollmentState={enrollmentState}
          curso={curso}
          polo={polo}
           isEditing={isEditing}
        />
        <InformationCard
          studentId={codigo_matricula}
          name={fullName}
          email={email}
          phone={phone}
          documento={"0000000"}
          address={address}
          course={curso}
          isEditing={isEditing}
          userId={userId}

        />
      </div>
    </div>
  )
}
