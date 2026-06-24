'use client';

import { useState, useEffect } from "react";
import {
  BarChart3, FileText, CalendarDays,
  UserCircle, MessageSquare, ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import studentsPhoto from "@/assets/black-students.jpg";
import { LogoBackground } from "./components/logo-background";

// ───────────────────────────────────────────────
// LÓGICA DE AMBIENTE, TEMA E PRAZO DE INSCRIÇÕES
// ───────────────────────────────────────────────
import { APP_ENV, isDevelop, isPrePrd } from '@/config/env';
import { useGetPrazoPorTipo } from '@/hooks/prazos';
import { TipoCalendario } from '@/enums/tipo-calendario.enum';
import { useTheme } from '@/hooks/use-theme';
import { LoginForm } from "./components/login-form";
import { ForgotPassword } from "./components/forgot-password-flow";
import { UpdateRequestForm } from "./components/update-data";
import { ValidateDocumentForm } from "./components/ValidarDocumentos";
import { RegisterForm } from "./components/register-form";
import { useQueryPortalStudentImage } from "@/hooks/use-query-portal-student-image";
import { buildImageAssets } from "@/utils/build-image-assets";


type View = "login" | "forgot" | "update-request" | "validate-doc" | "register";



const FEATURES = [
  { icon: BarChart3, text: "Consulta de notas e resultados académicos" },
  { icon: FileText, text: "Acesso às pautas e avaliações" },
  { icon: CalendarDays, text: "Calendário académico e horários de aulas" },
  { icon: UserCircle, text: "Dados pessoais e informações de matrícula" },
  { icon: MessageSquare, text: "Comunicados e avisos da instituição" },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export function Login() {
  const [view, setView] = useState<View>("login");
  const { data: portalStudentImage } = useQueryPortalStudentImage();
  const [loginBackground, setLoginBackground] = useState(studentsPhoto);

  // ── Forçar tema light (equivalente ao doc 2) ──
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('light');
  }, []);

  useEffect(() => {
    const imageUrl = buildImageAssets(portalStudentImage?.filename!);

    if (!imageUrl) {
      setLoginBackground(studentsPhoto);
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!cancelled) {
        setLoginBackground(imageUrl);
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setLoginBackground(studentsPhoto);
      }
    };

    image.src = imageUrl;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [portalStudentImage?.filename]);

  // ── Prazo de inscrições: botão de registo só aparece se estiver no prazo ──
  const { data: prazoResponseLinceiatura, isLoading: prazoLoadingLinceiatura } =
    useGetPrazoPorTipo({
      codigo_tipo_candidatura: 1,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
    })
    const { data: prazoResponseMestrado, isLoading: prazoLoadingMestrado } =
      useGetPrazoPorTipo({
        codigo_tipo_candidatura: 2,
        tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      })

  const { data: prazoResponseDotouramneto, isLoading: prazoLoadingDoutoramneto } =
    useGetPrazoPorTipo({
      codigo_tipo_candidatura: 3,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
    })
const prazos = [
  prazoResponseLinceiatura,
  prazoResponseMestrado,
  prazoResponseDotouramneto,
]
const loadings = [
  prazoLoadingLinceiatura,
  prazoLoadingMestrado,
  prazoLoadingDoutoramneto,
]

const SHOW_REGISTER_TAB =
  loadings.some(Boolean) || prazos.some((prazo) => prazo?.podeInscrever)

  const showEnvLabel = isDevelop || isPrePrd;
  const envDisplay = isDevelop
    ? `Ambiente: Desenvolvimento • v${APP_ENV}`
    : isPrePrd
      ? `Ambiente: Pré-produção • v${APP_ENV}`
      : '';

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* LEFT — foto + overlay */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden text-white p-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loginBackground})` }} aria-hidden />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(110, 15, 15, 0.65)" }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" aria-hidden />
      <div className="relative z-10 h-12" />
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Bem-vindo ao<br />
            Portal do <span style={{ color: "#F5A623" }}>Estudante</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/90">
            Consulte notas, pautas, horários e actividades académicas numa plataforma centralizada.
          </p>

          <ul className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-white/20"
                  style={{ backgroundColor: "rgba(245, 166, 35, 0.15)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "#F5A623" }} />
                </span>
                <span className="text-sm text-white/95">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/75">© {new Date().getFullYear()} Universidade Metodista de Angola</p>
        </div>
      </aside>

      {/* RIGHT — formulário dinâmico */}
      <main className="relative flex items-center justify-center p-6 sm:p-10 bg-white">
        <LogoBackground top="2.5rem" right="2.5rem" />
        <LogoBackground bottom="2.5rem" left="2.5rem" />

        <div className="relative w-full max-w-md space-y-6">
          {/* Banner mobile */}
          <div className="lg:hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-2 relative h-56 overflow-hidden text-white">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loginBackground})` }} />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(110, 15, 15, 0.65)" }} />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <h1 className="text-2xl font-bold leading-tight">
                Portal do <span style={{ color: "#F5A623" }}>Estudante</span>
              </h1>
              <p className="text-xs text-white/85 mt-1">Universidade Metodista de Angola</p>
            </div>
          </div>

          {view === "login" && <LoginForm setView={setView} showRegister={SHOW_REGISTER_TAB} />}
          {view === "forgot" && <ForgotPassword setView={setView} />}
          {view === "update-request" && <UpdateRequestForm setView={setView} />}
          {view === "validate-doc" && <ValidateDocumentForm setView={setView} />}
          {view === "register" && SHOW_REGISTER_TAB && <RegisterForm setView={setView} />}
        </div>

        {/* Label de ambiente */}
        {showEnvLabel && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50 text-center">
            {envDisplay}
          </div>
        )}
      </main>
    </div>
  );
}


export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Voltar
    </button>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5"
      style={{ backgroundColor: "#E02020", boxShadow: "0 10px 25px -10px rgba(224, 32, 32, 0.55)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B81818")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E02020")}
    >
      {children}
    </Button>
  );
}
