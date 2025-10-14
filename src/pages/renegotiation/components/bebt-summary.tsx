// import { Badge } from '@/components/ui/badge'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { AlertCircle } from 'lucide-react'

// export function BebtSummary() {
//   return (
//     <Card className="border-warning">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-warning" />
//               Dívidas Encontradas
//             </CardTitle>
//             <CardDescription>Faturas pendentes de pagamento</CardDescription>
//           </div>
//           <Badge variant="outline" className="text-warning border-warning">
//             {debtData.invoices.length} fatura(s)
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div>
//             <p className="text-sm text-muted-foreground">Total em atraso</p>
//             <p className="text-3xl font-bold text-warning">
//               {formatCurrency(debtData.totalOutstandingAmount)}
//             </p>
//           </div>
//           <div className="space-y-2">
//             {debtData.invoices.map((invoice) => (
//               <div
//                 key={invoice.reference}
//                 className="flex justify-between items-center p-3 bg-muted rounded-lg"
//               >
//                 <span className="text-sm">Referência: {invoice.reference}</span>
//                 <span className="font-semibold">
//                   {formatCurrency(invoice.amount)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
