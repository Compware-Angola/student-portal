import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


type ProfileAvatarProps = {
  firstName: string
  lastName: string
  curriculumYear?: string
  enrollmentState?: string
  curso?: string
  polo?: string
  isEditing:boolean
}

export function ProfileAvatar({
  firstName,
  lastName,
  curriculumYear,
  enrollmentState,
  curso,
  polo
}: ProfileAvatarProps) {
  const displayText = curriculumYear || enrollmentState

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Foto do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-32 w-32">
            <AvatarFallback className="text-3xl">
              {`${firstName[0]}${lastName[0]}`}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2 text-center">
          <h3 className="font-semibold">{`${firstName} ${lastName}`}</h3>
          {curso && <p className="text-sm text-muted-foreground">{curso}</p>}
          {polo && <p className="text-sm text-muted-foreground">{polo}</p>}
          {displayText && (
            <p className="text-sm text-muted-foreground">{displayText}</p>
          )}
        </div>
 {/*
        <Button className="w-full" disabled = {!isEditing} variant="outline">
          Alterar Foto
        </Button>
        */}
      </CardContent>
    </Card>
  )
}
