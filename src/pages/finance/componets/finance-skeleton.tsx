import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FinanceSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 " />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32 " />
                  <Skeleton className="h-4 w-24 " />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20 " />
                  <Skeleton className="h-8 w-8  rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2 justify-center flex-1">
              <Skeleton className="h-10 w-10 " />
              <Skeleton className="h-10 w-10 " />
              <Skeleton className="h-10 w-10 " />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
