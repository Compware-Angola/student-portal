import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo_uma.png";
import { LogoBackground } from "./components/logo-background";
import { useTheme } from "next-themes";
import heroAsset from "@/assets/hero-comunicados.jpg";
import { useGetAvisosGeral } from "@/hooks/use-get-aviso-imagem";
import { useQueryComunicadoBanner } from "@/hooks/use-query-comunicado-banner";
import { buildImageAssets } from "@/utils/build-image-assets";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ApiAviso = {
  id: number;
  assunto: string;
  descricao: string;
  date_expiracao?: string;
  created_at: string;
  tipo_aviso: string | null;
  file_name: string | null;
  status_?: number;
};

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

// ---------------------------------------------------------------------------
// Default slide backgrounds
// ---------------------------------------------------------------------------

const DEFAULT_SLIDES = [
  {
    bg: "bg-gradient-to-br from-[#3a0808] via-[#6b1010] to-[#E02020]",
    overlay: "bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(245,166,35,0.22),transparent)]",
    label: "Comunicados",
  },
  {
    bg: "bg-gradient-to-br from-[#0a1a3a] via-[#103060] to-[#1a5faa]",
    overlay: "bg-[radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(30,200,220,0.2),transparent)]",
    label: "Avisos",
  },
  {
    bg: "bg-gradient-to-br from-[#0d3322] via-[#145c38] to-[#22a060]",
    overlay: "bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(245,166,35,0.18),transparent)]",
    label: "Eventos",
  },
];

// ---------------------------------------------------------------------------
// Tipo Configuration
// ---------------------------------------------------------------------------

const TIPO_CONFIG: Record<Comunicado["tipo"], {
  label: string;
  icon: typeof Info;
  badge: string;
  bar: string;
  iconBg: string;
  dot: string;
}> = {
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

// ---------------------------------------------------------------------------
// API → Comunicado Mapper
// ---------------------------------------------------------------------------

function mapApiToComunicado(api: ApiAviso): Comunicado {
  const tipoRaw = (api.tipo_aviso || "informativo").toLowerCase();

  const tipoMap: Record<string, Comunicado["tipo"]> = {
    urgente: "urgente",
    aviso: "aviso",
    informativo: "informativo",
    evento: "evento",
  };

  const tipo = tipoMap[tipoRaw] ?? "informativo";

  return {
    id: api.id.toString(),
    tipo,
    titulo: api.assunto,
    resumo: api.descricao.length > 130
      ? api.descricao.substring(0, 127) + "..."
      : api.descricao,
    conteudo: api.descricao,
    data: new Date(api.created_at).toLocaleDateString("pt-AO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    autor: "Secretaria / Reitoria",
    fixado: false,
  };
}

// ---------------------------------------------------------------------------
// Hero Carousel (mantido igual)
// ---------------------------------------------------------------------------

interface HeroCarouselProps {
  heroImages?: string[];
  autoPlayMs?: number;
}

function HeroCarousel({ heroImages = [], autoPlayMs = 4500 }: HeroCarouselProps) {
  const hasImages = heroImages.length > 0;
  const count = hasImages ? heroImages.length : DEFAULT_SLIDES.length;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((next + count) % count);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, count]);

  const goNext = useCallback(() => go(current + 1), [current, go]);
  const goPrev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, autoPlayMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext, autoPlayMs]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, autoPlayMs);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const active = i === current;

        if (hasImages) {
          return (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                active ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <img
                src={heroImages[i]}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#3a0808]/90 via-[#6b1010]/75 to-[#E02020]/50" />
            </div>
          );
        }

        const slide = DEFAULT_SLIDES[i];
        return (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              slide.bg,
              active ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className={cn("absolute inset-0", slide.overlay)} />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 39px,white 39px,white 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,white 39px,white 40px)",
              }}
            />
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button
            aria-label="Slide anterior"
            onClick={() => { goPrev(); resetTimer(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/25 backdrop-blur hover:bg-black/40 border border-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <button
            aria-label="Próximo slide"
            onClick={() => { goNext(); resetTimer(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/25 backdrop-blur hover:bg-black/40 border border-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => { go(i); resetTimer(); }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "bg-[#F5A623] w-5 h-2"
                  : "bg-white/40 hover:bg-white/60 w-2 h-2"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface ComunicadoProps {
  heroImages?: string[];
}

export function Comunicado({ heroImages: propHeroImages }: ComunicadoProps) {
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState<"todos" | "urgente" | "aviso" | "informativo" | "evento">("todos");
  const { data: apiData, isLoading } = useGetAvisosGeral("EST");
  const { data: bannerData } = useQueryComunicadoBanner();
  const [bannerImage, setBannerImage] = useState(heroAsset);

  useEffect(() => {
    const bannerUrl = buildImageAssets(bannerData?.filename!);

    if (!bannerUrl) {
      setBannerImage(heroAsset);
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!cancelled) {
        setBannerImage(bannerUrl);
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setBannerImage(heroAsset);
      }
    };

    image.src = bannerUrl;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [bannerData?.filename]);

  // ==================== IMAGEM DO BANNER ====================
  const heroImages = useMemo(() => {
    if (propHeroImages && propHeroImages.length > 0) {
      return propHeroImages;
    }

    return [bannerImage];
  }, [propHeroImages, bannerImage]);

  // ==================== COMUNICADOS ====================
  const comunicados = useMemo(() => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map(mapApiToComunicado);
  }, [apiData]);

  const [selecionado, setSelecionado] = useState<Comunicado | null>(null);

  const lista = useMemo(() => {
    if (filtro === "todos") return comunicados;
    return comunicados.filter((c) => c.tipo === filtro);
  }, [comunicados, filtro]);

  // Atualiza item selecionado
  useEffect(() => {
    if (lista.length > 0 && !selecionado) {
      setSelecionado(lista[0]);
    }
  }, [lista, selecionado]);

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  if (comunicados.length === 0 && !isLoading) {
    if (typeof window !== "undefined") navigate("/");
    return null;
  }

  const filtros = [
    { value: "todos" as const, label: "Todos" },
    { value: "urgente" as const, label: "Urgentes" },
    { value: "aviso" as const, label: "Avisos" },
    { value: "informativo" as const, label: "Informativos" },
    { value: "evento" as const, label: "Eventos" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: 220 }}>
        <HeroCarousel heroImages={heroImages} />

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-5 pb-0 flex items-center justify-between">
          <img
            src={logo}
            alt="Universidade Metodista de Angola"
            className="h-9 w-auto brightness-0 invert opacity-90"
          />
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-pulse" />
            <Bell className="h-5 w-5 text-[#F5A623]" />
            &nbsp;{comunicados.length} novo(s)
          </span>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-8 pb-14">
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
                Tem <span className="font-semibold text-[#F5A623]">{comunicados.length}</span> comunicado(s) novo(s) da Universidade.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
      </section>

      {/* Filtros */}
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
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                )}
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto self-center text-xs text-slate-400">
            {lista.length} resultado(s)
          </span>
        </div>
      </div>

      {/* Main Content */}
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
                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                )}
              >
                <span className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl", cfg.bar)} />

                <div className="p-4 pl-5">
                  <div className="flex items-start gap-3">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", cfg.iconBg)}>
                      <Icon className="h-[18px] w-[18px]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border", cfg.badge)}>
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

                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {c.data}
                        </span>
                        <span className="text-slate-200">·</span>
                        <span>{c.autor}</span>
                      </div>
                    </div>

                    <ChevronRight className={cn("h-4 w-4 shrink-0 transition-all duration-200", isActive ? "text-[#E02020] translate-x-0.5" : "text-slate-300 group-hover:text-slate-400")} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalhe */}
        {selecionado && (
          <article className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden h-fit sticky top-6 shadow-sm">
            <div className={cn("h-1 w-full", TIPO_CONFIG[selecionado.tipo].bar)} />

            <div className="p-7">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border", TIPO_CONFIG[selecionado.tipo].badge)}>

                    {TIPO_CONFIG[selecionado.tipo].label}
                  </span>
                  {selecionado.fixado && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Pin className="h-3 w-3" /> Fixado
                    </span>
                  )}
                </div>
                <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1", TIPO_CONFIG[selecionado.tipo].dot)} />
              </div>

              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight leading-snug">
                {selecionado.titulo}
              </h2>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {selecionado.data}
                </span>
                <span className="text-slate-200">·</span>
                <span className="font-medium text-slate-500">{selecionado.autor}</span>
              </div>

              <div className="my-5 h-px bg-slate-100" />

              <p className="text-slate-700 leading-[1.75] text-[15px]">
                {selecionado.conteudo}
              </p>

              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Verificado
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
        )}
      </main>
    </div>
  );
}
