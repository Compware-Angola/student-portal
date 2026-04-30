import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { DiaSemana, AulaHorario } from '../utils'

const HOUR_START = 7
const HOUR_END = 20
const SLOT_MIN = 30
const ROW_PX = 28

const subjectColors: Record<string, string> = {}
const COLOR_POOL = [
    'bg-primary/10 border-l-primary',
    'bg-secondary/15 border-l-secondary',
    'bg-accent/15 border-l-accent',
]

let colorIndex = 0

function getSubjectColor(subject: string): string {
    if (!subjectColors[subject]) {
        subjectColors[subject] = COLOR_POOL[colorIndex % COLOR_POOL.length]
        colorIndex++
    }
    return subjectColors[subject]
}

type Props = {
    schedule: Record<DiaSemana, AulaHorario[]>
}

export function ScheduleGrid({ schedule }: Props) {
    const dias = useMemo(() => {
        return Object.entries(schedule).filter(
            ([, aulas]) => Array.isArray(aulas) && aulas.length > 0
        )
    }, [schedule])

    const totalSlots = ((HOUR_END - HOUR_START) * 60) / SLOT_MIN

    const hourLabels = useMemo(() => {
        const labels: string[] = []
        for (let h = HOUR_START; h < HOUR_END; h++) {
            labels.push(`${String(h).padStart(2, '0')}:00`)
        }
        return labels
    }, [])
    // 🔥 formatar hora (HH:mm)
    const formatTime = (time?: string | null): string => {
        if (!time) return ''
        if (time.includes('T')) return time.split('T')[1]?.slice(0, 5) || ''
        return time.slice(0, 5)
    }

    // 🔥 Converte hora para slot (SEM Date e SEM decimal)
    const timeToSlot = (
        time?: string | null,
        type: 'start' | 'end' = 'start'
    ): number | null => {
        if (!time || typeof time !== 'string') {
            console.warn('timeToSlot recebeu valor inválido:', time)
            return null
        }

        let h: number
        let m: number

        // ISO: 1970-01-01T10:30:00
        if (time.includes('T')) {
            const parts = time.split('T')[1]?.slice(0, 5) // "10:30"
            if (!parts) return null

            const [hh, mm] = parts.split(':')
            h = Number(hh)
            m = Number(mm)
        } else {
            // HH:mm
            const match = /^(\d{2}):(\d{2})$/.exec(time)
            if (!match) {
                console.warn('Formato de hora inválido:', time)
                return null
            }

            h = Number(match[1])
            m = Number(match[2])
        }

        if (h < 0 || h > 23 || m < 0 || m > 59) {
            console.warn('Hora fora do intervalo:', `${h}:${m}`)
            return null
        }

        const totalMinutes = (h - HOUR_START) * 60 + m

        if (totalMinutes < 0) {
            console.warn('Hora antes do início permitido:', `${h}:${m}`)
            return null
        }

        const rawSlot = totalMinutes / SLOT_MIN

        return type === 'start'
            ? Math.floor(rawSlot)
            : Math.ceil(rawSlot)
    }

    return (
        <>
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* Cabeçalho */}
                        <div
                            className="grid border-b bg-muted/30"
                            style={{
                                gridTemplateColumns: `70px repeat(${dias.length}, 1fr)`
                            }}
                        >
                            <div className="p-3 text-xs font-medium text-muted-foreground border-r">
                                Hora
                            </div>

                            {dias.map(([dia, aulas]) => (
                                <div key={dia} className="p-3 text-center border-r last:border-r-0">
                                    <p className="text-sm font-semibold">{dia}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {aulas.length} {aulas.length === 1 ? 'aula' : 'aulas'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Grelha */}
                        <div
                            className="grid relative"
                            style={{
                                gridTemplateColumns: `70px repeat(${dias.length}, 1fr)`
                            }}
                        >
                            {/* Horas */}
                            <div className="border-r">
                                {hourLabels.map((label) => (
                                    <div
                                        key={label}
                                        className="text-xs text-muted-foreground px-2 border-b flex items-start pt-1"
                                        style={{ height: `${ROW_PX * 2}px` }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Dias */}
                            {dias.map(([dia, aulas]) => (
                                <div
                                    key={dia}
                                    className="relative border-r last:border-r-0"
                                    style={{ height: `${ROW_PX * totalSlots}px` }}
                                >
                                    {/* Linhas */}
                                    {hourLabels.map((_, i) => (
                                        <div
                                            key={i}
                                            className="border-b border-dashed border-border/50"
                                            style={{ height: `${ROW_PX * 2}px` }}
                                        />
                                    ))}

                                    {/* Aulas */}
                                    {aulas.map((aula, idx) => {
                                        if (!aula?.hora_inicio || !aula?.hora_termino) {
                                            console.warn('Aula inválida:', aula)
                                            return null
                                        }

                                        const startSlot = timeToSlot(aula.hora_inicio, 'start')
                                        const endSlot = timeToSlot(aula.hora_termino, 'end')

                                        if (startSlot === null || endSlot === null) return null

                                        const top = startSlot * ROW_PX
                                        const height = Math.max(
                                            (endSlot - startSlot) * ROW_PX,
                                            ROW_PX
                                        )

                                        if (height <= 0) return null

                                        const colorClass = getSubjectColor(aula.disciplina)

                                        return (
                                            <div
                                                key={idx}
                                                className={`absolute left-1 right-1 rounded-md border-l-4 border border-border/50 p-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${colorClass}`}
                                                style={{
                                                    top: `${top}px`,
                                                    height: `${height}px`
                                                }}
                                                title={`${aula.disciplina} — ${aula.hora_inicio} a ${aula.hora_termino}`}
                                            >
                                                <p className="text-xs font-semibold truncate">
                                                    {aula.disciplina}
                                                </p>

                                                <p className="text-[10px] text-muted-foreground">
                                                    {formatTime(aula.hora_inicio)} - {formatTime(aula.hora_termino)}
                                                </p>

                                                {aula.sala && (
                                                    <p className="text-[10px] text-muted-foreground truncate">
                                                        {aula.sala}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legenda */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span className="font-medium">Legenda:</span>

                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary/30 border-l-2 border-l-primary" />
                    Teórica
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-secondary/30 border-l-2 border-l-secondary" />
                    Prática
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-accent/30 border-l-2 border-l-accent" />
                    Laboratório
                </div>
            </div>
        </>
    )
}