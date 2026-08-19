'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  XCircle,
  Send,
  Mail,
  Loader2,
  IdCard,
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
import { BackButton, PrimaryButton } from "..";
import { checkEmail, requestPasswordReset } from "@/services/auth/login.service";
import { toast } from "sonner";


// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const forgotSchema = z.object({
  bi: z.string().regex(/^\d{9}[A-Z]{2}\d{3}$/, "BI deve seguir o formato nacional"),
  email: z.string().email("E-mail inválido"),
});

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LoginFormProps {
  setView: (
    view: "login" | "forgot" | "update-request" | "validate-doc" | "register"
  ) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ForgotPassword({ setView }: LoginFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "found" | "sent" | "not-found"
  >("idle");
  const [apiMessage, setApiMessage] = useState<string>("");
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [verifiedBi, setVerifiedBi] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "", bi: "" },
  });

  // Step 1 — verifica se o e-mail existe
  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    setApiError("");
    setStatus("loading");

    try {
      const result = await checkEmail(data.email.toLowerCase().trim(), data.bi);

      if (result.exists) {
        setVerifiedEmail(data.email.toLowerCase().trim());
        setVerifiedBi(data.bi.toLowerCase().trim());
        setStatus("found"); // ← email encontrado, aguarda confirmação do utilizador
      } else {
        setStatus("not-found");
      }
    } catch {
      setApiError("Erro ao verificar o e-mail. Por favor tente novamente.");
      setStatus("idle");
    }
  };

  // Step 2 — envia o link de recuperação
  const handleSendLink = async () => {
    setIsSending(true);
    setApiError("");

    try {
      await requestPasswordReset(verifiedEmail, verifiedBi);
      toast.success('Link enviado!', {
        icon: <Mail className="h-5 w-5" />,
      })
      setStatus("sent"); // ← link enviado com sucesso
    } catch(err) {
      console.log('Erro real: ', err)
      setApiError("Erro ao enviar o link. Por favor tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setApiMessage("");
    setApiError("");
    setVerifiedEmail("");
    setVerifiedBi("");
    form.reset();
  };

  const isLoading = status === "loading";

  return (
    <>
      <BackButton onClick={() => setView("login")} />

      <div className="space-y-2">
        <h2 className="text-[28px] font-bold tracking-tight text-foreground leading-tight">
          Recuperar senha
        </h2>
        <p className="text-sm text-muted-foreground">
          Informe o seu BI e o  e-mail para receber as instruções.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STATE: Formulário (idle / loading)                                  */}
      {/* ------------------------------------------------------------------ */}
      {(status === "idle" || status === "loading") && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="bi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BI</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="número do BI"
                        disabled={isLoading}
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
                        disabled={isLoading}
                        className="h-11 pl-10 rounded-lg bg-slate-50 border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {apiError && (
              <p className="text-sm text-red-600">{apiError}</p>
            )}

            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "A verificar..." : "Enviar instruções"}
            </PrimaryButton>
          </form>
        </Form>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STATE: E-mail encontrado — aguarda confirmação para enviar o link   */}
      {/* ------------------------------------------------------------------ */}
      {status === "found" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            E-mail encontrado
          </div>
          <p>
            Encontrámos uma conta associada a{" "}
            <strong>{verifiedEmail}</strong>. Clique abaixo para receber
            o link de recuperação.
          </p>

          {apiError && (
            <p className="text-red-600 text-xs">{apiError}</p>
          )}

          <Button
            onClick={handleSendLink}
            disabled={isSending}
            className="w-full"
            style={{ backgroundColor: "#E02020", color: "white" }}
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSending ? "A enviar..." : "Enviar link de recuperação"}
          </Button>

          <Button
            variant="outline"
            onClick={resetForm}
            className="w-full"
          >
            Usar outro e-mail
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STATE: Link enviado com sucesso                                     */}
      {/* ------------------------------------------------------------------ */}
      {status === "sent" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-5 w-5" />
            Link enviado!
          </div>
          <p>{apiMessage}</p>
          <p className="text-xs text-green-700">
            Verifique também a sua pasta de spam caso não encontre o e-mail.
          </p>

          <Button
            variant="outline"
            onClick={() => setView("login")}
            className="w-full"
          >
            Voltar ao login
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STATE: E-mail não encontrado                                        */}
      {/* ------------------------------------------------------------------ */}
      {status === "not-found" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
          <div className="flex items-center gap-2 font-medium">
            <XCircle className="h-5 w-5" />
            Dados não encontrados
          </div>
          <p>
            Não encontrámos os seus dados (BI e e-mail) nos nossos registos.
          </p>
          <p className="text-xs text-amber-700">
            Se ainda não possui um e-mail registado, dirija-se ao instituto
            para actualizar os seus dados pessoais.
          </p>

          <Button
            type="button"
            onClick={() => setView("update-request")}
            className="w-full"
            style={{ backgroundColor: "#E02020", color: "white" }}
          >
            Solicitar actualização de dados
          </Button>

          <Button
            variant="outline"
            onClick={resetForm}
            className="w-full"
          >
            Tentar outro e-mail
          </Button>
        </div>
      )}
    </>
  );
}