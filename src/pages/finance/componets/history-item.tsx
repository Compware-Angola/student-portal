import { CheckCircle2 } from 'lucide-react'

type HistoryItemProps = {
  description: string
  amount: number
  date: string
  type: string
}

export const HistoryItem = ({
  description,
  amount,
  date,
  type,
}: HistoryItemProps) => (
  <div className="flex items-center justify-between bg-accent p-3 rounded-lg  border border-transparent hover:border-emerald-500/50 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <p className="text-white font-medium">{description}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm">{type}</span>
          <span className="text-sm">{date}</span>
        </div>
      </div>
    </div>
    <span className="text-emerald-400 font-semibold">
      AOA {amount.toLocaleString()}
    </span>
  </div>
)
