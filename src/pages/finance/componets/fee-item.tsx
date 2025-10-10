import { CheckCircle2, Clock, FileText } from 'lucide-react'

type Props = {
  title: string
  amount: number
  date: string
  status: 'paid' | 'pending'
  category: string
}

export const FeeItem = ({ title, amount, date, status, category }: Props) => {
  const statusConfig = {
    paid: { color: 'text-emerald-400', icon: CheckCircle2, label: 'Pago' },
    pending: { color: 'text-yellow-400', icon: Clock, label: 'Pendente' },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-accent border border-transparent hover:border-emerald-500/50 transition-all ">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm">{category}</span>
            <span className="text-sm">{date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white font-semibold">
          AOA {amount.toLocaleString()}
        </span>
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
      </div>
    </div>
  )
}
