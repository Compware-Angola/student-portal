import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type Props = {
  name: string
  status: string
}

export function ProfileAvatar({ name, status }: Props) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <Avatar className="h-32 w-32">
        <AvatarFallback className="text-4xl font-bold">
          {initial}
        </AvatarFallback>
      </Avatar>
      <Badge className="absolute bottom-0 bg-emerald-500 hover:bg-emerald-400 ">
        {status}
      </Badge>
    </div>
  )
}
