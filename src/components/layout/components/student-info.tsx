import { useEffect, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useGetFileUrl } from '@/hooks/upload/use-upload'
import { Link } from 'react-router-dom'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function StudentInfo() {
  const { profileData, isLoading } = useQueryProfile()

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('')

  const { mutateAsync: getFileUrlAsync } = useGetFileUrl()

  useEffect(() => {
    async function loadPhoto() {
      if (!profileData?.foto) {
        setCurrentPhotoUrl('')
        return
      }

      try {
        const response = await getFileUrlAsync({
          key: profileData.foto,
          expiry: 3600,
        })

        setCurrentPhotoUrl(response.url)
      } catch (error) {
        console.error('Erro ao carregar foto:', error)
        setCurrentPhotoUrl('')
      }
    }

    loadPhoto()
  }, [profileData?.foto, getFileUrlAsync])

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    )
  }

  const initials = `${profileData.firstName} ${profileData.lastName}`
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={currentPhotoUrl} alt={profileData.nome_completo} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="leading-tight text-center">
        <div className="flex items-center gap-2 text-sm font-medium">
          <strong>
            {profileData.firstName} {profileData.lastName}
          </strong>
          {'-'}
          <span>
            {profileData.enrollmentCode ?? profileData.preEnrollmentCode}
          </span>
        </div>

        <div className="text-xs text-muted-foreground">{profileData.curso}</div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/selecionar-pre-inscricao"
              aria-label="Trocar Inscrição"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Trocar Inscrição</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
