import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { buildImageAssets } from '@/utils/build-image-assets'

export function StudentInfo() {
  const { profileData, isLoading } = useQueryProfile()

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center gap-3">
        {/* Avatar skeleton */}
        <Skeleton className="h-10 w-10 rounded-full" />

        {/* Text skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    )
  }

  const initials = `${profileData.firstName} ${profileData.lastName}`
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const currentPhotoUrl = buildImageAssets(profileData.foto)
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={currentPhotoUrl} alt={profileData.nome_completo} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="leading-tight text-center">
        <div className="text-sm font-medium flex items-center gap-2">
          <strong>
            {profileData.firstName} {profileData.lastName}
          </strong>
          {'-'}
          {
            <span>
              {profileData.enrollmentCode ?? profileData.preEnrollmentCode}
            </span>
          }
        </div>
        <div className="text-xs text-muted-foreground">{profileData.curso}</div>
      </div>
    </div>
  )
}
