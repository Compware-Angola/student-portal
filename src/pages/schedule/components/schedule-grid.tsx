import { useMemo, useState } from "react";
import type { DiaSemana, AulaHorario } from "../utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  schedule: Record<DiaSemana, AulaHorario[]>;
  titulo?: string;
};

/* --- Funções Utilitárias Internas --- */

function timeToMin(time: string): number {
  if (!time) return 0;
  const clean = time.includes("T") ? time.split("T")[1]?.slice(0, 5) ?? "00:00" : time.slice(0, 5);
  const [h, m] = clean.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatTime(time?: string | null): string {
  if (!time) return "";
  return time.includes("T") ? time.split("T")[1]?.slice(0, 5) ?? "" : time.slice(0, 5);
}

// Gera uma cor consistente para cada disciplina
function disciplinaAccent(disciplina: string): string {
  let hash = 0;
  for (let i = 0; i < disciplina.length; i++) {
    hash = disciplina.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

// Extrai slots/turnos únicos baseados nas aulas existentes no schedule
function buildSlotsFromSchedule(schedule: Record<DiaSemana, AulaHorario[]>) {
  const map = new Map<string, { inicio: string; termino: string; key: string }>();

  Object.values(schedule).forEach((aulas) => {
    aulas?.forEach((aula) => {
      if (aula.hora_inicio && aula.hora_termino) {
        const inicio = formatTime(aula.hora_inicio);
        const termino = formatTime(aula.hora_termino);
        const key = `${inicio}-${termino}`;

        if (!map.has(key)) {
          map.set(key, { inicio, termino, key });
        }
      }
    });
  });

  return Array.from(map.values()).sort(
    (a, b) => timeToMin(a.inicio) - timeToMin(b.inicio)
  );
}

/* --- Card de Cada Aula --- */

function AulaCard({ aula, onClick }: { aula: AulaHorario; onClick: () => void }) {
  const accent = disciplinaAccent(aula.disciplina);
  const sala = aula.sala && aula.sala !== "N/A" ? aula.sala : "Sala a definir";
  const dur =
    aula.hora_inicio && aula.hora_termino
      ? timeToMin(aula.hora_termino) - timeToMin(aula.hora_inicio)
      : 0;

  return (
    <div
      onClick={onClick}
      className="group rounded-lg border border-border/60 bg-card p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <p className="text-sm font-semibold leading-snug text-card-foreground">
        {aula.disciplina}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{sala}</p>
      <div className="mt-2 flex items-center gap-2">
        {aula.tipo && (
          <span
            className="rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: `color-mix(in oklch, ${accent} 18%, transparent)`,
              color: accent,
            }}
          >
            {aula.tipo}
          </span>
        )}
        {dur > 0 && <span className="text-[0.65rem] text-muted-foreground">{dur} min</span>}
      </div>
    </div>
  );
}

/* --- Grid Principal --- */

export function ScheduleGrid({ schedule, titulo = "Horário de Aulas" }: Props) {
  const [filtro, setFiltro] = useState<string>("todos");
  const [selectedAula, setSelectedAula] = useState<AulaHorario | null>(null);

  // Dias com dados no schedule (ex: Segunda-feira, Terça-feira...)
  const dias = useMemo(() => {
    return Object.keys(schedule) as DiaSemana[];
  }, [schedule]);

  // Turnos dinâmicos baseados no horário real fornecido
  const slots = useMemo(() => buildSlotsFromSchedule(schedule), [schedule]);

  // Total geral de aulas
  const totalAulasCount = useMemo(() => {
    return Object.values(schedule).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  }, [schedule]);

  // Lista de disciplinas únicas para o filtro select
  const disciplinas = useMemo(() => {
    const set = new Set<string>();
    Object.values(schedule).forEach((aulas) =>
      aulas?.forEach((a) => {
        if (a.disciplina) set.add(a.disciplina);
      })
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt"));
  }, [schedule]);

  // Tipos únicos (Ex: TP, PL, T)
  const tipos = useMemo(() => {
    const set = new Set<string>();
    Object.values(schedule).forEach((aulas) =>
      aulas?.forEach((a) => {
        if (a.tipo) set.add(a.tipo);
      })
    );
    return Array.from(set).sort();
  }, [schedule]);

  // Largura mínima calculada dinamicamente com base no nº de dias
  // (8.125rem da coluna de hora + 17.5rem por dia)
  const minWidthRem = useMemo(() => 8.125 + dias.length * 17.5, [dias.length]);
  const gridCols = `8.125rem repeat(${dias.length}, minmax(17.5rem, 1fr))`;

  const visivel = (a: AulaHorario) => filtro === "todos" || a.disciplina === filtro;

  return (
    <>
      <section className="w-full">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              {titulo}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalAulasCount} aulas  · {disciplinas.length} disciplinas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tipos.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-secondary-foreground"
              >
                {t}
              </span>
            ))}
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filtrar por disciplina"
            >
              <option value="todos">Todas as disciplinas</option>
              {disciplinas.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="overflow-x-auto rounded-xl border border-border bg-card/40 shadow-sm">
          <div style={{ minWidth: `${minWidthRem}rem` }}>
            {/* Cabeçalho */}
            <div
              className="grid border-b border-border bg-secondary/60"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                Hora
              </div>
              {dias.map((d) => (
                <div
                  key={d}
                  className="border-l border-border px-3 py-2.5 text-[0.7rem] font-semibold uppercase tracking-wide text-foreground whitespace-nowrap"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Turnos e Células de Aulas */}
            {slots.map((slot, i) => (
              <div
                key={slot.key}
                className={`grid border-b border-border/70 last:border-b-0 ${i % 2 ? "bg-muted/30" : ""}`}
                style={{ gridTemplateColumns: gridCols }}
              >
                <div className="px-3.5 py-3">
                  <p className="text-sm font-semibold tabular-nums text-foreground">{slot.inicio}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{slot.termino}</p>
                </div>
                {dias.map((dia) => {
                  const aulasNoSlot = (schedule[dia] || [])
                    .filter((a) => {
                      const inicio = formatTime(a.hora_inicio);
                      const termino = formatTime(a.hora_termino);
                      return inicio === slot.inicio && termino === slot.termino;
                    })
                    .filter(visivel);

                  return (
                    <div key={dia} className="min-h-[84px] space-y-2 border-l border-border/70 p-2.5">
                      {aulasNoSlot.map((a, idx) => (
                        <AulaCard
                          key={`${a.disciplina}-${idx}`}
                          aula={a}
                          onClick={() => setSelectedAula(a)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Detalhes da Aula */}
      <Dialog open={!!selectedAula} onOpenChange={() => setSelectedAula(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedAula?.disciplina}</DialogTitle>
          </DialogHeader>

          {selectedAula && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Horário:</span>{" "}
                <span className="font-mono">
                  {formatTime(selectedAula.hora_inicio)} - {formatTime(selectedAula.hora_termino)}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Sala:</span>{" "}
                {selectedAula.sala || "N/A"}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Tipo:</span>{" "}
                {selectedAula.tipo || "N/A"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}