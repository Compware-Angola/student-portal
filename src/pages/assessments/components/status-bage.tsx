import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusType =
    | 'Reprovado'
    | 'Em curso'
    | 'Fez com Sucesso'
    | 'Pendente'
    | 'Eliminado'

type StatusBadgeProps = {
    statusId?: number
    media?: number | null
}

function getEstadoById(id: number): StatusType {
    const estados: Record<number, StatusType> = {
        1: 'Reprovado',
        2: 'Em curso',
        3: 'Fez com Sucesso',
        4: 'Pendente',
        5: 'Eliminado',
    }

    return estados[id] ?? 'Pendente'
}

function getEstadoByMedia(media: number | null): StatusType {
    if (media === null || media === undefined) {
        return 'Pendente'
    }

    if (media >= 10) {
        return 'Fez com Sucesso'
    }

    return 'Reprovado'
}

function StatusBadgeCustom({ statusId, media }: StatusBadgeProps) {
    // Prioridade:
    // 1 - statusId
    // 2 - media
    const estado: StatusType =
        statusId !== undefined
            ? getEstadoById(statusId)
            : getEstadoByMedia(media ?? null)

    const statusConfig: Record<
        StatusType,
        {
            color: string
            dot: string
        }
    > = {
        Reprovado: {
            color:
                'bg-red-600/10 text-red-600 focus-visible:ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:focus-visible:ring-red-400/40',
            dot: 'bg-red-600 dark:bg-red-400',
        },

        'Em curso': {
            color:
                'bg-blue-600/10 text-blue-600 focus-visible:ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:focus-visible:ring-blue-400/40',
            dot: 'bg-blue-600 dark:bg-blue-400',
        },

        'Fez com Sucesso': {
            color:
                'bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40',
            dot: 'bg-green-600 dark:bg-green-400',
        },

        Pendente: {
            color:
                'bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40',
            dot: 'bg-amber-600 dark:bg-amber-400',
        },

        Eliminado: {
            color:
                'bg-gray-600/10 text-gray-600 focus-visible:ring-gray-600/20 dark:bg-gray-400/10 dark:text-gray-400 dark:focus-visible:ring-gray-400/40',
            dot: 'bg-gray-600 dark:bg-gray-400',
        },
    }

    const currentStatus = statusConfig[estado]

    return (
        <Badge
            className={cn(
                'rounded-full border-none focus-visible:outline-none focus-visible:ring-2 flex items-center gap-1.5',
                currentStatus.color,
            )}
        >
            <span
                className={cn('size-1.5 rounded-full', currentStatus.dot)}
                aria-hidden="true"
            />

            {estado}
        </Badge>
    )
}

export default StatusBadgeCustom