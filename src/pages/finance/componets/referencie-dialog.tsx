import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

type Referencia = {
  REFERENCE: string
  ENTITY_ID: string
  END_DATE: string
  Status: "Pending" | "Success" | "Expired" | string
}

type ReferenciasDialogProps = {
  referencias: Referencia[],
  estado: number
}

export function ReferenciasDialog({ referencias, estado }: ReferenciasDialogProps) {
  if (referencias.length === 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {referencias.length} referência{referencias.length > 1 ? "s" : ""}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Referências de Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {referencias
            .sort(
              (a, b) =>
                new Date(b.END_DATE).getTime() - new Date(a.END_DATE).getTime(),
            )
            .map((ref, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
              >
                <div className="font-mono text-lg font-bold">
                  {ref.REFERENCE}
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2">
                    <Badge
                      variant={
                        ref.Status === "Pending"
                          ? "default"
                          : ref.Status === "Success"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {ref.Status}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Entidade: <strong>{ref.ENTITY_ID}</strong>
                  </div>
                  {estado == 1 && ref.Status == 'Success' ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      <span className="size-1.5 rounded-full bg-green-600 mr-1.5" />
                      Pago
                    </Badge>

                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {ref.Status === "Expired" || new Date(ref.END_DATE) < new Date() ? (
                        <>
                          Expirou em:{" "}
                          <strong className="text-destructive">
                            {format(new Date(ref.END_DATE), "dd MMMM yyyy", { locale: pt })}
                          </strong>
                        </>
                      ) : (
                        <>
                          Expira em:{" "}
                          <strong>
                            {format(new Date(ref.END_DATE), "dd MMMM yyyy", { locale: pt })}
                          </strong>
                        </>
                      )}
                    </div>
                  )}

                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}