import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableDemo } from "@/components/ui/data-table";



export function ConfirmEnrollment() {
  return <>
    <Card className="rounded-md">
      <CardHeader>
         <CardTitle>Listas das Disciplinas</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTableDemo  />
      </CardContent>
    </Card>
  </>
}