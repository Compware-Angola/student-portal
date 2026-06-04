'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2, XCircle, Send,
  Mail
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { BackButton, PrimaryButton } from "..";




const REGISTERED_EMAILS = new Set([
  "estudante@metodista.ao",
  "joao.silva@metodista.ao",
  "maria.santos@metodista.ao",
]);

const forgotSchema = z.object({
  email: z.string().email("E-mail inválido"),
});
interface LoginFormProps {
  setView: (view: "login" | "forgot" | "update-request" | "validate-doc" | "register") => void;
}
export function ForgotPassword({ setView }: LoginFormProps) {
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
