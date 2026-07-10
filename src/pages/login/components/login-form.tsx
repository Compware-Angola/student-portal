'use client';

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
  UserPlus,
  ShieldCheck,
  XCircle,
  Mail,
  Send,
  Loader2,
  ArrowLeft,
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

import logo from "@/assets/logo_uma.png";
import { useAuthMutation } from "@/auth/use-auth-mutation";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "@/services/auth/login.service";
import { toast } from "sonner";

// ─── Schemas ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const firstAccessSchema = z.object({
  email: z.string().email("E-mail inválido"),
  matricula: z.string().nonempty("Matrícula é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type FirstAccessFormData = z.infer<typeof firstAccessSchema>;

// ─── Props ─────────────────────────────────────────────────────────────────

interface LoginFormProps {
  setView: (view: "login" | "forgot" | "update-request" | "validate-doc" | "register") => void;
  showRegister: boolean;
}

// ─── Componente principal ──────────────────────────────────────────────────

export function LoginForm({ setView, showRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Controla o sub-passo de primeiro acesso
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [firstAccessLoading, setFirstAccessLoading] = useState(false);
  const [firstAccessError, setFirstAccessError] = useState<string | null>(null);

  const navigate = useNavigate();
  const authMutation = useAuthMutation();

  // ── Formulário de login ────────────────────────────────────────────────
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // ── Formulário de e-mail (primeiro acesso) ─────────────────────────────
  const firstAccessForm = useForm<FirstAccessFormData>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: { email: "" },
  });

  // ── Submit do login ────────────────────────────────────────────────────
  const onLoginSubmit = (data: LoginFormData) => {
    setLoginError(null);
    setSubmitting(true);

    const credentials = { ...data, platform: "PORTAL" };
    authMutation.mutate(credentials, {
      onSuccess: (response: any) => {
        if (response?.user.password_reset_required) {
          setIsFirstAccess(true);
          setSubmitting(false);
          return;
        }
        loginForm.reset();
        navigate("/comunicado");
      },
      onError: (error: Error) => {
        setLoginError(error.message);
        setSubmitting(false);
      },
    });
  };

  // ── Submit do e-mail de primeiro acesso ───────────────────────────────
  const onFirstAccessSubmit = async (data: FirstAccessFormData) => {
    setFirstAccessError(null);
    setFirstAccessLoading(true);

    try {
      await requestPasswordReset(data.email, data.matricula);
      toast.success('Link enviado, verifique a sua caixa de e-mail e siga as instruções para redefinir a senha.', {
        icon: <Mail className="h-5 w-5" />,
      })

      // Após registar, redireciona para redefinição de senha ou login
      navigate("/renovar-senha");
    } catch (error: any) {
      setFirstAccessError(error.message);
    } finally {
      setFirstAccessLoading(false);
    }
  };

  // ─── Passo de primeiro acesso ────────────────────────────────────────────
  if (isFirstAccess) {
    return (
      <>
        {/* Botão voltar */}
        <button
          type="button"
          onClick={() => {
            setIsFirstAccess(false);
            setFirstAccessError(null);
            firstAccessForm.reset();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </button>

        <div className="space-y-2">
          <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
            Primeiro acesso
          </h2>
          <p className="text-sm text-muted-foreground">
            Para concluir o seu primeiro acesso, precisamos do seu e-mail
            institucional para lhe enviar as instruções de activação.
          </p>
        </div>

        <Form {...firstAccessForm}>
          <form
            onSubmit={firstAccessForm.handleSubmit(onFirstAccessSubmit)}
            className="space-y-5"
          >
            <FormField
              control={firstAccessForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail institucional</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="seu.email@metodista.ao"
                        disabled={firstAccessLoading}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*Vou adicionar Mas um Campo para verificar se é Aluno (Matricula)*/}
            <FormField
              control={firstAccessForm.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="number"
                        placeholder="202315631"
                        disabled={firstAccessLoading}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {firstAccessError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                {firstAccessError}
              </div>
            )}

            <Button
              type="submit"
              disabled={firstAccessLoading}
              className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: "#E02020",
                boxShadow: "0 10px 25px -10px rgba(224, 32, 32, 0.55)",
              }}
            >
              {firstAccessLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {firstAccessLoading ? "A enviar..." : "Continuar"}
            </Button>
          </form>
        </Form>
      </>
    );
  }

  // ─── Formulário de login normal ──────────────────────────────────────────
  return (
    <>
      <div className="space-y-2">
        <div className="hidden lg:flex justify-center">
          <img src={logo} alt="Metodista de Angola" className="h-20 w-auto" />
        </div>
        <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
          Entrar na conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Digite suas credenciais para aceder ao portal.
        </p>
      </div>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
          {/* Username */}
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username (BI ou Email)</FormLabel>
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

          {/* Senha */}
          <FormField
            control={loginForm.control}
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

          {/* Erro de login */}
          {loginError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "#E02020",
              boxShadow: "0 10px 25px -10px rgba(224, 32, 32, 0.55)",
            }}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {submitting ? "Entrando..." : "Entrar"}
          </Button>

          {/* Links */}
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

          {/* Registo */}
          {showRegister && (
            <>
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
            </>
          )}
        </form>
      </Form>
    </>
  );
}
