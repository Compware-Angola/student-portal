import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
type ProfileAvatarProps = {
  firstName: string
  lastName: string
  curriculumYear: string
}

export function ProfileAvatar({
  firstName,
  lastName,
  curriculumYear,
}: ProfileAvatarProps) {
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
          <p className="text-sm text-muted-foreground">N/A</p>
          <p className="text-sm text-muted-foreground">{curriculumYear}</p>
        </div>
        <Button className="w-full" variant="outline">
          Alterar Foto
        </Button>
      </CardContent>
    </Card>
  )
}
