import { Skeleton } from '@/components/ui/skeleton'
import { ProfileCardSkeleton } from './components/profile-card-skeleton'
import { InformationCard } from './components/information-card'
import { ProfileAvatar } from './components/profile-avatar'
import { InfoCardSkeleton } from './components/info-card-skeleton'
import { toast } from 'sonner'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

export function Profile() {
  const {
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    profileData,
  } = useQueryProfile()
  console.log(isProfileLoading)

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
    
  } = profileData
  console.log(birthDate.toString())

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
          enrollmentState={enrollmentState}
          curso={curso}
          polo={polo}
        />
        <InformationCard
          name={fullName}
          email={email}
          phone={phone}
          dateOfBirth={birthDate}
          address={address}
          course={curso}
        />
      </div>
    </div>
  )
}
