import { Skeleton } from '@/components/ui/skeleton'
import { useProfileData } from '@/hooks/use-profile-data'

export function HeaderWelcome() {
  const { profileData, isLoading } = useProfileData()

  if (isLoading) {
    return <Skeleton className="w-60 h-4" />
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {profileData.gender === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'},{' '}
        <span>{`${profileData.firstName} ${profileData.lastName}`}</span>
      </h1>
      <p className="text-muted-foreground">{profileData.curriculumYear}</p>
    </div>
  )
}
