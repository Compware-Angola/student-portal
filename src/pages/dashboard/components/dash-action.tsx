import { Card, CardContent } from '@/components/ui/card'
import type { ReactNode } from 'react'
interface IDashAction {
  title: string
  content: string
  icon: ReactNode
  onClick: () => void
}
export function DashAction({ content, icon, title, onClick }: IDashAction) {
  return (
    <>
      <Card
        className="rounded-sm shadow-none cursor-pointer "
        onClick={onClick}
      >
        <CardContent className="flex items-center space-x-2">
          <div className="w-[48px] h-[48px] flex rounded-full bg-[#F8F6F7] justify-center items-center">
            {icon}
          </div>
          <div>
            <h5 className="scroll-m-20 text-[16px] mb-1 font-medium tracking-tight">
              {title}
            </h5>
            <p className="text-xs">{content}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
