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

// Schema de validação
const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  setView: (view: "login" | "forgot" | "update-request" | "validate-doc" | "register") => void;
  showRegister: boolean;
}

export function LoginForm({ setView, showRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authMutation = useAuthMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    setLoginError(null);
    setSubmitting(true);
    const credentials = {
      ...data,
      platform: 'PORTAL',
    }

    authMutation.mutate(credentials, {
      onSuccess: () => {
        form.reset();
        navigate('/comunicado')
      },
      onError: (error: Error) => {
        setLoginError(error.message);
        setSubmitting(false);
      },
    });
  };

  return (
    <>
      {/* Cabeçalho */}
      <div className="space-y-2">
        {/* Logo Desktop */}
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

      {/* Formulário */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Número de Estudante */}
          <FormField
            control={form.control}
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

          {/* Senha com toggle */}
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

          {/* Mensagem de erro */}
          {loginError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}

          {/* Botão Entrar */}
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-lg text-white transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#E02020", boxShadow: "0 10px 25px -10px rgba(224, 32, 32, 0.55)" }}
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

          {/* Registro */}
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
