import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function FinanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payments">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <Skeleton className="h-4 w-16" />
          </TabsTrigger>
          <TabsTrigger value="references">
            <Skeleton className="h-4 w-24" />
          </TabsTrigger>
        </TabsList>

        {/* Payments Tab Skeleton */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-9 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab Skeleton */}
        <TabsContent value="invoices" className="mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-right p-4">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-40" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-6 w-16" />
                        </td>
                        <td className="p-4 text-right">
                          <Skeleton className="h-9 w-32 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* References Tab Skeleton */}
        <TabsContent value="references" className="mt-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-52" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-12" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-left p-4">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-right p-4">
                        <Skeleton className="h-4 w-12 ml-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4">
                          <Skeleton className="h-5 w-32" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-6 w-16" />
                        </td>
                        <td className="p-4 text-right">
                          <Skeleton className="h-9 w-32 ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
