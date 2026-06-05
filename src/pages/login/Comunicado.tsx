import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Info,
  Megaphone,
  CheckCircle2,
  ArrowRight,

  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroAsset from "@/assets/hero-comunicados.jpg";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo_uma.png";
import { LogoBackground } from "./components/logo-background";
import { useTheme } from "next-themes";

type Comunicado = {
  id: string;
  tipo: "urgente" | "aviso" | "informativo" | "evento";
  titulo: string;
  resumo: string;
  conteudo: string;
  data: string;
  autor: string;
  fixado?: boolean;
};

const MOCK_COMUNICADOS: Comunicado[] = [
  {
    id: "1",
    tipo: "urgente",
    titulo: "Prazo final de matrícula — 2.º Semestre 2026",
    resumo:
      "A secretaria académica informa que o prazo para regularização das matrículas termina no dia 20 de Junho.",
    conteudo:
      "Caros estudantes, recordamos que o prazo para regularização das matrículas do 2.º semestre do ano lectivo 2025/2026 termina no dia 20 de Junho de 2026, às 17h00. Não serão aceites pedidos fora deste prazo.",
    data: "5 de Junho, 2026",
    autor: "Secretaria Académica",
    fixado: true,
  },
  {
    id: "2",
    tipo: "evento",
    titulo: "Conferência de Abertura do Ano Académico",
    resumo:
      "Convidamos toda a comunidade académica para a conferência de abertura no Auditório Principal.",
    conteudo:
      "A conferência terá início às 9h00 do dia 12 de Junho, com a presença do Magnífico Reitor e palestrantes convidados de instituições parceiras.",
    data: "3 de Junho, 2026",
    autor: "Reitoria",
  },
  {
    id: "3",
    tipo: "informativo",
    titulo: "Novo horário de atendimento da Tesouraria",
    resumo:
      "A partir desta semana, a tesouraria passa a funcionar das 8h00 às 16h00, de segunda a sexta-feira.",
    conteudo:
      "Para melhor servir os estudantes, o horário de atendimento da tesouraria foi alargado. Recomendamos a marcação prévia através do portal.",
    data: "1 de Junho, 2026",
    autor: "Departamento Financeiro",
  },
];

const TIPO_CONFIG: Record<
  Comunicado["tipo"],
  { label: string; icon: typeof Info; badge: string; bar: string; iconBg: string; dot: string }
> = {
  urgente: {
    label: "Urgente",
    icon: AlertTriangle,
    badge: "bg-red-50 text-red-700 border-red-200",
    bar: "bg-[#E02020]",
    iconBg: "bg-red-50 text-[#E02020]",
    dot: "bg-[#E02020]",
  },
  aviso: {
    label: "Aviso",
    icon: Bell,
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    bar: "bg-[#F5A623]",
    iconBg: "bg-amber-50 text-[#F5A623]",
    dot: "bg-[#F5A623]",
  },
  informativo: {
    label: "Informativo",
    icon: Info,
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    bar: "bg-slate-400",
    iconBg: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  evento: {
    label: "Evento",
    icon: Megaphone,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
};

export function Comunicado() {
  // ── Forçar tema light (equivalente ao doc 2) ──
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('light');
  }, []);
  const navigate = useNavigate();
  const comunicados = MOCK_COMUNICADOS;
  const [filtro, setFiltro] = useState<"todos" | Comunicado["tipo"]>("todos");
  const [selecionado, setSelecionado] = useState<Comunicado | null>(
    comunicados[0] ?? null,
  );

  const lista = useMemo(
    () =>
      filtro === "todos"
        ? comunicados
        : comunicados.filter((c) => c.tipo === filtro),
    [comunicados, filtro],
  );

  if (comunicados.length === 0) {
    if (typeof window !== "undefined") navigate("/");
    return null;
  }

  const filtros: Array<{ value: typeof filtro; label: string }> = [
    { value: "todos", label: "Todos" },
    { value: "urgente", label: "Urgentes" },
    { value: "aviso", label: "Avisos" },
    { value: "informativo", label: "Informativos" },
    { value: "evento", label: "Eventos" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]">

      {/* Hero — full-width, logo integrado */}
      <section className="relative overflow-hidden text-white">
        <img
          src={heroAsset}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradiente mais rico e profundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a0808]/97 via-[#6b1010]/90 to-[#E02020]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(245,166,35,0.18),transparent)]" />

        {/* Logo + nav no topo do hero */}
        <div className="relative max-w-7xl mx-auto px-6 pt-5 pb-0 flex items-center justify-between">
          <img
            src={logo}
            alt="Universidade Metodista de Angola"
            className="h-9 w-auto brightness-0 invert opacity-90"
          />
          {/* Badge de novos comunicados */}
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-pulse" />
            <Bell className="h-5 w-5 text-[#F5A623]" />  {comunicados.length} novo(s)
          </span>
        </div>

        {/* Conteúdo hero */}
        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-12">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="h-5 w-5 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-semibold mb-1">
                Comunicados & Avisos
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Mantenha-se informado
              </h1>
              <p className="text-white/75 mt-2.5 text-sm sm:text-[15px] leading-relaxed">
                Tem{" "}
                <span className="font-semibold text-[#F5A623]">
                  {comunicados.length} comunicado(s)
                </span>{" "}
                novo(s) da Universidade. Confira as informações antes de continuar.
              </p>
            </div>
          </div>
        </div>

        {/* Borda suave na base do hero */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Filtros — flutuando levemente abaixo do hero */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => {
            const active = filtro === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
                  active
                    ? "bg-[#E02020] text-white border-[#E02020] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm",
                )}
              >
                {f.label}
              </button>
            );
          })}
          {/* Separador + contador */}
          <span className="ml-auto self-center text-xs text-slate-400">
            {lista.length} resultado(s)
          </span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-6 pb-12 grid lg:grid-cols-[1fr_1.5fr] gap-5">
        <LogoBackground bottom="2.5rem" left="2.5rem" />

        {/* Lista */}
        <div className="space-y-2.5">
          {lista.map((c) => {
            const cfg = TIPO_CONFIG[c.tipo];
            const Icon = cfg.icon;
            const isActive = selecionado?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelecionado(c)}
                className={cn(
                  "group w-full text-left bg-white rounded-2xl border overflow-hidden transition-all duration-200 relative",
                  isActive
                    ? "border-[#E02020]/40 shadow-[0_0_0_2px_rgba(224,32,32,0.15)] shadow-md"
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md",
                )}
              >
                {/* Barra lateral colorida */}
                <span className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl", cfg.bar)} />

                <div className="p-4 pl-5">
                  <div className="flex items-start gap-3">
                    {/* Ícone */}
                    <div
                      className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200",
                        cfg.iconBg,
                        "group-hover:scale-105",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                            cfg.badge,
                          )}
                        >
                          {cfg.label}
                        </span>
                        {c.fixado && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Pin className="h-3 w-3" /> Fixado
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug">
                        {c.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {c.resumo}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {c.data}
                        </span>
                        <span className="text-slate-200">·</span>
                        <span>{c.autor}</span>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-200",
                        isActive
                          ? "text-[#E02020] translate-x-0.5"
                          : "text-slate-300 group-hover:text-slate-400",
                      )}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel de detalhe */}
        {selecionado &&
          (() => {
            const cfg = TIPO_CONFIG[selecionado.tipo];
            const Icon = cfg.icon;
            return (
              <article className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden h-fit sticky top-6 shadow-sm">
                {/* Topo colorido fino */}
                <div className={cn("h-1 w-full", cfg.bar)} />

                <div className="p-7">
                  {/* Cabeçalho do detalhe */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                          cfg.badge,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                      {selecionado.fixado && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <Pin className="h-3 w-3" /> Fixado
                        </span>
                      )}
                    </div>

                    {/* Dot indicador */}
                    <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", cfg.dot)} />
                  </div>

                  {/* Título */}
                  <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-snug">
                    {selecionado.titulo}
                  </h2>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {selecionado.data}
                    </span>
                    <span className="text-slate-200">·</span>
                    <span className="font-medium text-slate-500">{selecionado.autor}</span>
                  </div>

                  {/* Divisor */}
                  <div className="my-5 h-px bg-slate-100" />

                  {/* Conteúdo */}
                  <p className="text-slate-700 leading-[1.75] text-[15px]">
                    {selecionado.conteudo}
                  </p>

                  {/* Rodapé */}
                  <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="inline-flex items-center gap-2 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Marcado como lido
                    </div>
                    <button
                      onClick={() => navigate("/")}
                      className="inline-flex items-center justify-center gap-2 bg-[#E02020] hover:bg-[#c01818] active:bg-[#a81414] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      Continuar para o portal
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })()}
      </main>
    </div>
  );
}