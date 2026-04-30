import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { DiaSemana, AulaHorario } from '../utils'

const HOUR_START = 7
const HOUR_END = 20
const ROW_H = 56 // px por hora

const COLOR_POOL = [
    'bg-purple-100 border-l-purple-600 text-purple-900 dark:bg-purple-900/25 dark:text-purple-200',
    'bg-teal-100 border-l-teal-600 text-teal-900 dark:bg-teal-900/25 dark:text-teal-200',
    'bg-orange-100 border-l-orange-600 text-orange-900 dark:bg-orange-900/25 dark:text-orange-200',
    'bg-pink-100 border-l-pink-500 text-pink-900 dark:bg-pink-900/25 dark:text-pink-200',
    'bg-blue-100 border-l-blue-600 text-blue-900 dark:bg-blue-900/25 dark:text-blue-200',
    'bg-green-100 border-l-green-600 text-green-900 dark:bg-green-900/25 dark:text-green-200',
]

const subjectColors: Record<string, string> = {}
let colorIndex = 0

function getSubjectColor(subject: string): string {
    if (!subjectColors[subject]) {
        subjectColors[subject] = COLOR_POOL[colorIndex % COLOR_POOL.length]
        colorIndex++
    }
    return subjectColors[subject]
}

function timeToMin(time: string): number {
    const clean = time.includes('T') ? time.split('T')[1]?.slice(0, 5) ?? '00:00' : time.slice(0, 5)
    const [h, m] = clean.split(':').map(Number)
    return h * 60 + m
}

function formatTime(time?: string | null): string {
    if (!time) return ''
    const t = time.includes('T') ? time.split('T')[1]?.slice(0, 5) : time.slice(0, 5)
    return t ?? ''
}

type AulaComColuna = AulaHorario & {
    _col: number
    _totalCols: number
}

function computeColumns(aulas: AulaHorario[]): AulaComColuna[] {
    const sorted = aulas
        .filter(a => a.hora_inicio && a.hora_termino)
        .map((a, i) => ({ ...a, _idx: i }))
        .sort((a, b) => timeToMin(a.hora_inicio!) - timeToMin(b.hora_inicio!))

    // Atribui coluna a cada aula (greedy)
    const cols: typeof sorted[] = []
    const aulaCol: Record<number, number> = {}

    for (const aula of sorted) {
        const start = timeToMin(aula.hora_inicio!)
        const end = timeToMin(aula.hora_termino!)
        let col = 0
        while (true) {
            const conflict = cols[col]?.some(other => {
                const os = timeToMin(other.hora_inicio!)
                const oe = timeToMin(other.hora_termino!)
                return start < oe && end > os
            })
            if (!conflict) break
            col++
        }
        if (!cols[col]) cols[col] = []
        cols[col].push(aula)
        aulaCol[aula._idx] = col
    }

    // Calcula total de colunas que cada aula ocupa
    const aulaTotalCols: Record<number, number> = {}
    for (const aula of sorted) {
        const start = timeToMin(aula.hora_inicio!)
        const end = timeToMin(aula.hora_termino!)
        let maxCol = aulaCol[aula._idx]
        for (const other of sorted) {
            if (other._idx === aula._idx) continue
            const os = timeToMin(other.hora_inicio!)
            const oe = timeToMin(other.hora_termino!)
            if (start < oe && end > os) {
                maxCol = Math.max(maxCol, aulaCol[other._idx])
            }
        }
        aulaTotalCols[aula._idx] = maxCol + 1
    }

    return sorted.map(a => ({
        ...a,
        _col: aulaCol[a._idx],
        _totalCols: aulaTotalCols[a._idx],
    }))
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

    const totalHours = HOUR_END - HOUR_START
    const gridHeight = totalHours * ROW_H

    const hourLabels = useMemo(() => {
        return Array.from({ length: totalHours }, (_, i) =>
            `${String(HOUR_START + i).padStart(2, '0')}:00`
        )
    }, [totalHours])

    const aulasComColunas = useMemo(() => {
        return Object.fromEntries(
            dias.map(([dia, aulas]) => [dia, computeColumns(aulas)])
        )
    }, [dias])

    return (
        <>
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[700px]">

                        {/* Cabeçalho */}
                        <div
                            className="grid border-b bg-muted/30"
                            style={{ gridTemplateColumns: `52px repeat(${dias.length}, 1fr)` }}
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
                            className="grid"
                            style={{ gridTemplateColumns: `52px repeat(${dias.length}, 1fr)` }}
                        >
                            {/* Coluna de horas */}
                            <div className="border-r">
                                {hourLabels.map((label) => (
                                    <div
                                        key={label}
                                        className="text-[11px] text-muted-foreground px-2 border-b flex items-start pt-1"
                                        style={{ height: `${ROW_H}px` }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Colunas dos dias */}
                            {dias.map(([dia]) => {
                                const aulas = aulasComColunas[dia] ?? []
                                return (
                                    <div
                                        key={dia}
                                        className="relative border-r last:border-r-0"
                                        style={{ height: `${gridHeight}px` }}
                                    >
                                        {/* Linhas de hora */}
                                        {hourLabels.map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute left-0 right-0 border-b border-border/40"
                                                style={{ top: `${i * ROW_H}px` }}
                                            />
                                        ))}
                                        {/* Linhas de meia hora */}
                                        {hourLabels.map((_, i) => (
                                            <div
                                                key={`half-${i}`}
                                                className="absolute left-0 right-0 border-b border-dashed border-border/20"
                                                style={{ top: `${i * ROW_H + ROW_H / 2}px` }}
                                            />
                                        ))}

                                        {/* Aulas — sem sobreposição */}
                                        {aulas.map((aula, idx) => {
                                            const startMin = timeToMin(aula.hora_inicio!) - HOUR_START * 60
                                            const endMin = timeToMin(aula.hora_termino!) - HOUR_START * 60
                                            const top = (startMin / 60) * ROW_H
                                            const height = Math.max(((endMin - startMin) / 60) * ROW_H - 2, 20)

                                            const pct = 100 / aula._totalCols
                                            const left = `calc(${aula._col * pct}% + 2px)`
                                            const width = `calc(${pct}% - 4px)`
                                            const colorClass = getSubjectColor(aula.disciplina)

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`absolute rounded-md border-l-[3px] border border-black/10 p-1.5 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${colorClass}`}
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                        left,
                                                        width,
                                                        zIndex: aula._col + 1,
                                                    }}
                                                    title={`${aula.disciplina} — ${formatTime(aula.hora_inicio)} a ${formatTime(aula.hora_termino)}`}
                                                >
                                                    <p className="text-[11px] font-semibold truncate leading-tight">
                                                        {aula.disciplina}
                                                    </p>
                                                    <p className="text-[10px] opacity-70 mt-0.5">
                                                        {formatTime(aula.hora_inicio)} – {formatTime(aula.hora_termino)}
                                                    </p>
                                                    {aula.sala && (
                                                        <p className="text-[10px] opacity-60 truncate">
                                                            {aula.sala}
                                                        </p>
                                                    )}

                                                    {aula.tipo && (
                                                        <p className="text-[10px] font-medium mt-0.5 opacity-75 truncate">
                                                            {aula.tipo}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legenda dinâmica por disciplina */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span className="font-medium">Disciplinas:</span>
                {Object.entries(subjectColors).map(([name, cls]) => (
                    <div key={name} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm border-l-2 ${cls}`} />
                        {name}
                    </div>
                ))}
            </div>
            {/* Legend - Show when there are no schedules */}

        </>
    )
}