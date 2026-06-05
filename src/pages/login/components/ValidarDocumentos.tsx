'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ShieldCheck, Search,
    CheckCircle2, XCircle,
    User,
    Hash,
    BookOpen,
    Calendar,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";


import { useValidateDocument } from '@/hooks/docs/use-validate-document';
import { BackButton, PrimaryButton } from "..";
type View = 'login' | 'forgot' | 'update-request' | 'validate-doc' | 'register'
// ─── UI auxiliar ───────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    )
}




export function ValidateDocumentForm({ setView }: { setView: (v: View) => void }) {
    const docSchema = z.object({
        numero: z.string().min(3, "Número de documento inválido").max(50),
    });
    const [codigoAtivo, setCodigoAtivo] = useState('')
    const {
        data: doc,

        isError,
        isFetched,
        refetch,
    } = useValidateDocument(codigoAtivo)
    const isValido = isFetched && !!doc && !isError
    const isInvalido = isFetched && (isError || !doc)


    const form = useForm<z.infer<typeof docSchema>>({
        resolver: zodResolver(docSchema),
        defaultValues: { numero: "" },
    });

    const onSubmit = (data: z.infer<typeof docSchema>) => {
        setCodigoAtivo(data.numero.trim())
        refetch()
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

            {isValido && doc && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-5 space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-green-800">
                        <CheckCircle2 className="h-5 w-5" />
                        Documento válido
                    </div>
                    <dl className="grid grid-cols-1 gap-2 text-sm">
                        <InfoRow icon={User} label="Nome" value={doc.nome_completo} />
                        <InfoRow icon={Hash} label="Nº Matrícula" value={String(doc.codigo_matricula)} />
                        <InfoRow icon={BookOpen} label="Curso" value={doc.curso} />
                        <InfoRow icon={Calendar} label="Data de Registo" value={doc.data_registo} />
                        <InfoRow icon={User} label="Faculdade" value={doc.faculdade} />
                        <InfoRow icon={BookOpen} label="Tipo de Documento" value={doc.tipo_documento} />
                    </dl>
                </div>
            )}

            {isInvalido && (
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