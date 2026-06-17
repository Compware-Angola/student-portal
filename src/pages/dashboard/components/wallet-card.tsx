import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { formatCurrency } from '@/utils'

type WalletCardProps = {
    balance: number
    onClick?: () => void
}

export function WalletCard({ balance, onClick }: WalletCardProps) {
    return (
        <Card
            className={`transition-colors ${onClick ? 'cursor-pointer hover:bg-muted/40 active:bg-muted/60' : ''}`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reserva</CardTitle>
                <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                <p className="text-xs text-muted-foreground">Saldo atual</p>
            </CardContent>
        </Card>
    )
}