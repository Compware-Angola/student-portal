import { Card, CardContent } from '@/components/ui/card'

type Props = {
  title: string
  value: string | number
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  color: string
  description?: string
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  description,
}: Props) => (
  <Card className="">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {description && <p className="text-xs mt-1">{description}</p>}
        </div>
        <div
          className={`w-14 h-14 rounded-full ${color} flex items-center justify-center`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </CardContent>
  </Card>
)
