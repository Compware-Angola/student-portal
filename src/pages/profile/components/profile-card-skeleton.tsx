import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileCardSkeleton() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Foto do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-4 w-28 mx-auto" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
