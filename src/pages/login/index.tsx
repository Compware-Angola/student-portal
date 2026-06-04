
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  LogIn,
  BarChart3,
  FileText,
  CalendarDays,
  UserCircle,
  MessageSquare,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Hash,
  Send,
  UserPlus,
  GraduationCap,
  IdCard,
  ClipboardList,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import logo from "@/assets/logo_uma.png";
import studentsPhoto from "@/assets/black-students.jpg";

// Feature flag: registo aberto apenas em determinadas épocas (controlado por boolean).
const REGISTRATION_OPEN = true;

const FACULDADES = [
  "Faculdade de Engenharia",
  "Faculdade de Ciências Económicas",
  "Faculdade de Direito",
  "Faculdade de Ciências da Saúde",
  "Faculdade de Educação",
  "Faculdade de Teologia",
];

const TIPOS_CANDIDATURA = [
  "1ª Vez (Acesso ao Ensino Superior)",
  "Transferência",
  "Mudança de Curso",
  "Reingresso",
];

const TIPOS_DOCUMENTO = [
  "Bilhete de Identidade",
  "Passaporte",
  "Cartão de Residente",
];


type View =
  | "login"
  | "forgot"
  | "update-request"
  | "validate-doc"
  | "register";


const REGISTERED_EMAILS = new Set([
  "estudante@metodista.ao",
  "joao.silva@metodista.ao",
  "maria.santos@metodista.ao",
]);


const DOCUMENT_DB: Record<
  string,
  { nome: string; curso: string; matricula: string; estado: string; emissao: string }
> = {
  "DOC-2024-001": {
    nome: "João Manuel Silva",
    curso: "Engenharia Informática",
    matricula: "2024001234",
    estado: "Válido",
    emissao: "12/03/2024",
  },
  "DOC-2024-002": {
    nome: "Maria Santos",
    curso: "Gestão de Empresas",
    matricula: "2024001567",
    estado: "Válido",
    emissao: "05/05/2024",
  },
};

const FEATURES = [
  { icon: BarChart3, text: "Consulta de notas e resultados académicos" },
  { icon: FileText, text: "Acesso às pautas e avaliações" },
  { icon: CalendarDays, text: "Calendário académico e horários de aulas" },
  { icon: UserCircle, text: "Dados pessoais e informações de matrícula" },
  { icon: MessageSquare, text: "Comunicados e avisos da instituição" },
];

 export  function Login() {
  const [view, setView] = useState<View>("login");

  return (
    <div className="min-h-screen grid lg:grid-cols-[6fr_4fr] bg-white">
      {/* LEFT — photo + maroon overlay */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden text-white p-12 min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studentsPhoto})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(110, 15, 15, 0.65)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
          aria-hidden
        />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Bem-vindo ao
            <br />
            Portal do <span style={{ color: "#F5A623" }}>Estudante</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-white/90">
            Consulte notas, pautas, horários e actividades académicas numa
            plataforma centralizada.
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
          <p className="text-xs text-white/75">
            © {new Date().getFullYear()} Universidade Metodista de Angola
          </p>
        </div>
      </aside>

      {/* RIGHT — dynamic form */}
      <main className="relative flex items-center justify-center p-6 sm:p-10 bg-white overflow-hidden">
     

        <div className="relative w-full max-w-md space-y-6">
          {/* Mobile banner */}
          <div className="lg:hidden -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-2 relative h-56 overflow-hidden text-white">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${studentsPhoto})` }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(110, 15, 15, 0.65)" }}
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <h1 className="text-2xl font-bold leading-tight">
                Portal do <span style={{ color: "#F5A623" }}>Estudante</span>
              </h1>
              <p className="text-xs text-white/85 mt-1">
                Universidade Metodista de Angola
              </p>
            </div>
          </div>

          {view === "login" && <LoginForm setView={setView} />}
          {view === "forgot" && <ForgotPasswordForm setView={setView} />}
          {view === "update-request" && <UpdateRequestForm setView={setView} />}
          {view === "validate-doc" && <ValidateDocumentForm setView={setView} />}
          {view === "register" && <RegisterForm setView={setView} />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

const loginSchema = z.object({
  studentId: z.string().min(4, "Número de estudante inválido").max(20),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

function LoginForm({ setView }: { setView: (v: View) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { studentId: "", password: "" },
  });

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
          Entrar na conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Digite suas credenciais para aceder ao portal.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Estudante</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      autoComplete="username"
                      placeholder="ex: 2024001234"
                      className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PrimaryButton type="submit" disabled={submitting}>
            <LogIn className="mr-2 h-4 w-4" />
            {submitting ? "Entrando..." : "Entrar"}
          </PrimaryButton>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setView("forgot")}
              className="font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Esqueceu a senha?
            </button>
            <button
              type="button"
              onClick={() => setView("validate-doc")}
              className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Validar documento
            </button>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-2 text-muted-foreground">Novo estudante?</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView("register")}
            className="inline-flex w-full items-center justify-center gap-2 h-11 rounded-lg border border-slate-200 bg-white text-sm font-medium text-foreground hover:bg-slate-50 transition-colors"
          >
            <UserPlus className="h-4 w-4" style={{ color: "#E02020" }} />
            Criar a sua conta
          </button>
        </form>
      </Form>
    </>
  );
}

/* ---------------- FORGOT PASSWORD ---------------- */

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

function ForgotPasswordForm({ setView }: { setView: (v: View) => void }) {
  const [status, setStatus] = useState<"idle" | "sent" | "not-found">("idle");

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: z.infer<typeof forgotSchema>) => {
    if (REGISTERED_EMAILS.has(data.email.toLowerCase())) {
      setStatus("sent");
    } else {
      setStatus("not-found");
    }
  };

  return (
    <>
      <BackButton onClick={() => setView("login")} />
      <div className="space-y-2">
        <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
          Recuperar senha
        </h2>
        <p className="text-sm text-muted-foreground">
          Informe o seu e-mail institucional para receber as instruções.
        </p>
      </div>

      {status === "sent" ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            E-mail enviado
          </div>
          <p>Enviámos um link de recuperação para o seu e-mail. Verifique a sua caixa de entrada.</p>
          <Button variant="outline" onClick={() => setView("login")} className="w-full">
            Voltar ao login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu.email@metodista.ao"
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {status === "not-found" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
                <div className="flex items-center gap-2 font-medium">
                  <XCircle className="h-5 w-5" />
                  E-mail não encontrado
                </div>
                <p>
                  Este e-mail não consta dos nossos registos. Pode solicitar a actualização dos seus
                  dados pessoais.
                </p>
                <Button
                  type="button"
                  onClick={() => setView("update-request")}
                  className="w-full"
                  style={{ backgroundColor: "#E02020", color: "white" }}
                >
                  Solicitar actualização de dados
                </Button>
              </div>
            )}

            <PrimaryButton type="submit">
              <Send className="mr-2 h-4 w-4" />
              Enviar instruções
            </PrimaryButton>
          </form>
        </Form>
      )}
    </>
  );
}

/* ---------------- UPDATE REQUEST ---------------- */

const updateSchema = z.object({
  matricula: z.string().min(4, "Matrícula inválida").max(20),
  telefone: z.string().min(9, "Telefone inválido").max(20),
  novoEmail: z.string().email("E-mail inválido"),
  motivos: z.string().min(10, "Descreva os motivos (mín. 10 caracteres)").max(500),
});

function UpdateRequestForm({ setView }: { setView: (v: View) => void }) {
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { matricula: "", telefone: "", novoEmail: "", motivos: "" },
  });

  const onSubmit = () => setSent(true);

  if (sent) {
    return (
      <>
        <BackButton onClick={() => setView("login")} />
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-base">
            <CheckCircle2 className="h-5 w-5" />
            Solicitação enviada
          </div>
          <p>
            A sua solicitação foi recebida. Os Serviços Académicos irão analisar e responder ao
            novo e-mail informado em até 72 horas úteis.
          </p>
          <Button variant="outline" onClick={() => setView("login")} className="w-full">
            Voltar ao login
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <BackButton onClick={() => setView("forgot")} />
      <div className="space-y-2">
        <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
          Solicitar actualização de dados
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha o formulário para que os Serviços Académicos actualizem o seu cadastro.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Matrícula</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} placeholder="ex: 2024001234" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} placeholder="+244 9XX XXX XXX" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="novoEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Novo E-mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} type="email" placeholder="novo.email@exemplo.com" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivos</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    placeholder="Descreva o motivo da actualização..."
                    className="flex w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PrimaryButton type="submit">
            <Send className="mr-2 h-4 w-4" />
            Enviar solicitação
          </PrimaryButton>
        </form>
      </Form>
    </>
  );
}

/* ---------------- VALIDATE DOCUMENT ---------------- */

const docSchema = z.object({
  numero: z.string().min(3, "Número de documento inválido").max(50),
});

function ValidateDocumentForm({ setView }: { setView: (v: View) => void }) {
  const [result, setResult] = useState<
    | { kind: "idle" }
    | { kind: "valid"; data: (typeof DOCUMENT_DB)[string] }
    | { kind: "not-found" }
  >({ kind: "idle" });

  const form = useForm<z.infer<typeof docSchema>>({
    resolver: zodResolver(docSchema),
    defaultValues: { numero: "" },
  });

  const onSubmit = (data: z.infer<typeof docSchema>) => {
    const found = DOCUMENT_DB[data.numero.trim().toUpperCase()];
    if (found) setResult({ kind: "valid", data: found });
    else setResult({ kind: "not-found" });
  };

  return (
    <>
      <BackButton onClick={() => setView("login")} />
      <div className="space-y-2">
        <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
          Validar documento
        </h2>
        <p className="text-sm text-muted-foreground">
          Insira o número do documento emitido pela instituição para verificar a sua autenticidade.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do documento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} placeholder="ex: DOC-2024-001" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PrimaryButton type="submit">
            <Search className="mr-2 h-4 w-4" />
            Validar
          </PrimaryButton>
        </form>
      </Form>

      {result.kind === "valid" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Documento válido
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <Row label="Nome" value={result.data.nome} />
            <Row label="Curso" value={result.data.curso} />
            <Row label="Matrícula" value={result.data.matricula} />
            <Row label="Data de emissão" value={result.data.emissao} />
            <Row label="Estado" value={result.data.estado} />
          </dl>
        </div>
      )}

      {result.kind === "not-found" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <div className="flex items-center gap-2 font-semibold">
            <XCircle className="h-5 w-5" />
            Documento não encontrado
          </div>
          <p className="mt-1 text-red-700">
            Verifique se digitou o número correctamente ou contacte os Serviços Académicos.
          </p>
        </div>
      )}
    </>
  );
}

/* ---------------- helpers ---------------- */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-green-200/50 last:border-b-0 py-1">
      <dt className="text-green-900/70">{label}</dt>
      <dd className="font-medium text-green-900 text-right">{value}</dd>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
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

function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      {...props}
      className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: "#E02020",
        boxShadow: "0 10px 25px -10px rgba(224, 32, 32, 0.55)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#B81818")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E02020")}
    >
      {children}
    </Button>
  );
}

/* ---------------- REGISTER (cadastro) ---------------- */

const registerSchema = z.object({
  nomeCompleto: z.string().trim().min(3, "Nome inválido").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().min(9, "Telefone inválido").max(20),
  faculdade: z.string().min(1, "Seleccione a faculdade"),
  tipoCandidatura: z.string().min(1, "Seleccione o tipo de candidatura"),
  tipoDocumento: z.string().min(1, "Seleccione o tipo de documento"),
  numeroDocumento: z.string().trim().min(4, "Número inválido").max(40),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme a sua senha"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

function RegisterForm({ setView }: { setView: (v: View) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      telefone: "",
      faculdade: "",
      tipoCandidatura: "",
      tipoDocumento: "",
      numeroDocumento: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  // Período de candidaturas fechado: mostrar aviso e bloquear o formulário.
  if (!REGISTRATION_OPEN) {
    return (
      <>
        <BackButton onClick={() => setView("login")} />
        <div className="space-y-2">
          <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
            Candidaturas encerradas
          </h2>
          <p className="text-sm text-muted-foreground">
            O período de candidaturas não está activo neste momento.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Info className="h-5 w-5" />
            Inscrições temporariamente indisponíveis
          </div>
          <p>
            As inscrições para novos estudantes só estão abertas em determinadas
            épocas do ano académico. Acompanhe os comunicados oficiais da
            Universidade Metodista de Angola para saber a próxima data de abertura.
          </p>
        </div>
        <Button variant="outline" onClick={() => setView("login")} className="w-full">
          Voltar ao login
        </Button>
      </>
    );
  }

  if (sent) {
    return (
      <>
        <BackButton onClick={() => setView("login")} />
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-base">
            <CheckCircle2 className="h-5 w-5" />
            Candidatura submetida
          </div>
          <p>
            Recebemos a sua candidatura. Os Serviços Académicos irão validar os
            dados e enviar as próximas instruções para o e-mail informado.
          </p>
          <Button variant="outline" onClick={() => setView("login")} className="w-full">
            Voltar ao login
          </Button>
        </div>
      </>
    );
  }

  const onSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  };

  return (
    <>
      <BackButton onClick={() => setView("login")} />
      <div className="space-y-2">
        <h2 className="text-[26px] font-bold tracking-tight text-foreground leading-tight">
          Criar a sua conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha os dados para iniciar o processo de candidatura.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input {...field} placeholder="ex: João Manuel Silva" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} type="email" placeholder="seu@mail.com" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} placeholder="+244 9XX XXX XXX" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="faculdade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faculdade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Seleccione a faculdade" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FACULDADES.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoCandidatura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de candidatura</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Seleccione o tipo" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIPOS_CANDIDATURA.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg bg-slate-50 border-slate-200">
                        <div className="flex items-center gap-2">
                          <IdCard className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Seleccione" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPOS_DOCUMENTO.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numeroDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº do documento</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input {...field} placeholder="ex: 000000000LA000" className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 px-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <PrimaryButton type="submit" disabled={submitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            {submitting ? "A criar conta..." : "Criar a sua conta"}
          </PrimaryButton>
        </form>
      </Form>
    </>
  );
}
