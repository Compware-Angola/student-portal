import { CheckCircle2 } from 'lucide-react'
type Props = {
  semester: string
  amount: number
  discount: number
}

export function HistoryItem({ semester, amount, discount }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-accent border border-border">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold">{semester}</h4>
        <p className="text-slate-400 text-sm">
          AOA {amount.toLocaleString()} ({discount}% desconto)
        </p>
      </div>
    </div>
  )
}
