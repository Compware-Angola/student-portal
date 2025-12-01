// src/components/forgot-password-flow.tsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertCircle, Key, Search, Mail } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type Step = "email" | "found" | "not-found";

export function ForgotPasswordFlow({ onBack }: { onBack: () => void }) {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Simulação de busca no banco (substituir por chamada real à API)
    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) return;

        setIsLoading(true);
        // Simulação de delay de API
        await new Promise(resolve => setTimeout(resolve, 1200));

        // EXEMPLO: emails que existem no sistema
        const emailsExistentes = [
            "joao.silva@estudante.uma.ao",
            "maria.fernandes@uma.ao",
            "pedro.santos@estudante.uma.ao"
        ];

        setIsLoading(false);

        if (emailsExistentes.includes(email.toLowerCase())) {
            setStep("found");
        } else {
            setStep("not-found");
        }
    };

    const handleResetPassword = () => {
        toast.success("Link de recuperação enviado!", {
            description: `Verifique seu e-mail: ${email}`,
            icon: <Mail className="h-5 w-5" />,
        });
        setStep("email");
        setEmail("");
    };

    return (
        <div className="space-y-6">
            {/* Botão Voltar */}
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao login
            </Button>

            {/* Passo 1: Digitar e-mail */}
            {step === "email" && (
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                            <Key className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
                        <CardDescription>
                            Digite seu e-mail institucional para continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCheckEmail} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail institucional</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seunome@estudante.uma.ao"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>Verificando...</>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Continuar
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Passo 2: E-mail encontrado → Mostrar dados + botão reset */}
            {step === "found" && (
                <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-green-900 dark:text-green-100">
                                    E-mail encontrado!
                                </CardTitle>
                                <CardDescription>
                                    Sua conta está ativa no sistema
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Enviaremos um link seguro para redefinir sua senha.
                            </AlertDescription>
                        </Alert>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">E-mail</span>
                                <span className="font-medium">{email}</span>
                            </div>
                        </div>

                        <Button onClick={handleResetPassword} size="lg" className="w-full">
                            <Key className="mr-2 h-4 w-4" />
                            Enviar Link de Recuperação
                        </Button>

                        <Button variant="outline" onClick={() => setStep("email")} className="w-full">
                            Usar outro e-mail
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Passo 3: E-mail NÃO encontrado → Formulário de atualização */}
            {step === "not-found" && (
                <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <CardTitle>E-mail não encontrado</CardTitle>
                                <CardDescription>
                                    Não localizamos uma conta com este e-mail
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Seu e-mail pode estar desatualizado no sistema. Preencha o formulário abaixo para solicitar a correção.
                            </AlertDescription>
                        </Alert>

                        {/* Reutilizamos o teu componente de atualização, mas com foco no e-mail */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-semibold">Solicitar Atualização de Dados</h3>
                            {/* Aqui você pode reutilizar parte do teu componente AtualizacaoDados ou criar um simplificado */}
                            <AtualizacaoDadosSimples emailInicial={email} />
                        </div>

                        <Button variant="outline" onClick={() => setStep("email")} className="w-full">
                            Tentar outro e-mail
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Componente simplificado só para este fluxo (evita carregar tudo)
function AtualizacaoDadosSimples({ emailInicial }: { emailInicial: string }) {
    const [motivo, setMotivo] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Solicitação enviada com sucesso!", {
            description: "A secretaria irá analisar e entrará em contato em breve.",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>E-mail que você usa atualmente</Label>
                <Input value={emailInicial} disabled className="mt-2" />
            </div>
            <div>
                <Label>Novo Email*</Label>
                <Input value={newEmail} className="mt-2" onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="motivo">Motivo da solicitação *</Label>
                <Textarea
                    id="motivo"
                    placeholder="Ex: mudei de e-mail, não recebo notificações, etc."
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                    rows={3}
                    className="mt-2"
                />
            </div>
            <Button type="submit" className="w-full">
                Enviar Solicitação à Secretaria
            </Button>
        </form>
    );
}