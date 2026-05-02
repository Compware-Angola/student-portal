import { useState, useEffect, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    Hourglass,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    User,
    FileText,
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
<style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`}</style>

// ====== Configuração da Prova ======
// Para testar a tela de prova ativa, troque a data abaixo para o passado
// ex: new Date(Date.now() - 1000) — ou ajuste FORCE_EXAM_OPEN para true.
const EXAM_DATE = new Date("2026-05-15T08:00:00");
const EXAM_DURATION_MIN = 120;
const FORCE_EXAM_OPEN = false;

const examInfo = {
    candidate: "João Silva",
    course: "Engenharia Informática",
    room: "Auditório A — Bloco 2",
    time: "08:00 — 10:00",
    subjects: ["Matemática", "Física", "Língua Portuguesa"],
};

const questions = [
    {
        id: 1,
        subject: "Matemática",
        statement: "Qual é o valor de x na equação 2x + 6 = 18?",
        options: ["x = 4", "x = 6", "x = 8", "x = 12"],
    },
    {
        id: 2,
        subject: "Matemática",
        statement: "O resultado de (3²) + (4²) é:",
        options: ["25", "49", "12", "7"],
    },
    {
        id: 3,
        subject: "Física",
        statement: "A unidade de medida da força no Sistema Internacional é:",
        options: ["Joule (J)", "Watt (W)", "Newton (N)", "Pascal (Pa)"],
    },
    {
        id: 4,
        subject: "Física",
        statement: "Qual a velocidade da luz no vácuo (aproximadamente)?",
        options: ["3 × 10⁵ km/s", "3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s"],
    },
    {
        id: 5,
        subject: "Língua Portuguesa",
        statement: "Qual das opções apresenta um substantivo coletivo?",
        options: ["Mesa", "Cardume", "Correr", "Bonito"],
    },
    {
        id: 6,
        subject: "Língua Portuguesa",
        statement: "“Os alunos estudaram muito.” — O sujeito da frase é:",
        options: ["estudaram", "muito", "Os alunos", "alunos muito"],
    },
];

function useCountdown(target: Date) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { diff, days, hours, minutes, seconds };
}

const ProvaExameAcesso = () => {
    const { diff, days, hours, minutes, seconds } = useCountdown(EXAM_DATE);
    const examOpen = FORCE_EXAM_OPEN || diff === 0;

    // Estado da prova
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [remaining, setRemaining] = useState(EXAM_DURATION_MIN * 60);

    useEffect(() => {
        if (!examOpen || submitted) return;
        const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
        return () => clearInterval(t);
    }, [examOpen, submitted]);

    useEffect(() => {
        if (examOpen && !submitted && remaining === 0) {
            setSubmitted(true);
            toast.success("Tempo esgotado! A sua prova foi submetida automaticamente.");
        }
    }, [remaining, examOpen, submitted]);

    const answeredCount = Object.keys(answers).length;
    const progress = useMemo(() => (answeredCount / questions.length) * 100, [answeredCount]);

    const formatClock = (s: number) => {
        const h = String(Math.floor(s / 3600)).padStart(2, "0");
        const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const sec = String(s % 60).padStart(2, "0");
        return `${h}:${m}:${sec}`;
    };

    const handleSubmit = () => {
        setSubmitted(true);
        toast.success(`Prova submetida com sucesso! Você respondeu ${answeredCount} de ${questions.length} perguntas.`)
    };

    // ============ TELA: PROVA AINDA NÃO INICIOU ============
    if (!examOpen) {
        return (

            <div
                className="space-y-6"
                style={{ animation: "fadeIn 0.4s ease-in" }}
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Prova de Admissão</h1>
                    <p className="text-muted-foreground">
                        Acompanhe os detalhes da sua prova e prepare-se para o grande dia.
                    </p>
                </div>

                {/* Card principal com informações */}
                <Card className="border-l-4 border-l-primary overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                        <div className="flex items-start justify-between flex-wrap gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <FileText className="h-6 w-6 text-primary" />
                                    Detalhes da Prova
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Confirme com atenção a data, hora e local da prova.
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-sm">
                                Aguardando Início
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoTile icon={<User className="h-5 w-5" />} label="Candidato" value={examInfo.candidate} />
                            <InfoTile icon={<BookOpen className="h-5 w-5" />} label="Curso" value={examInfo.course} />
                            <InfoTile
                                icon={<Calendar className="h-5 w-5" />}
                                label="Data"
                                value={EXAM_DATE.toLocaleDateString("pt-PT", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            />
                            <InfoTile icon={<Clock className="h-5 w-5" />} label="Horário" value={examInfo.time} />
                        </div>

                        <Separator />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 text-primary" /> Local da Prova
                                </div>
                                <p className="text-lg font-semibold">{examInfo.room}</p>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                    <BookOpen className="h-4 w-4 text-primary" /> Disciplinas
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {examInfo.subjects.map((s) => (
                                        <Badge key={s} variant="outline" className="text-sm">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de contagem regressiva com ampulheta animada */}
                <Card className="overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                            {/* Ampulheta animada */}
                            {/* Ampulheta animada */}
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse" />

                                {/* Rotação da ampulheta a cada 2s usando CSS inline */}
                                <div
                                    style={{
                                        animation: "spin 2s ease-in-out infinite",
                                    }}
                                    className="relative"
                                >
                                    <Hourglass
                                        className="h-24 w-24 text-primary drop-shadow-lg"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Pontos de "areia caindo" */}
                                <div className="absolute flex flex-col items-center gap-1 top-1/2">
                                    {[0, 0.3, 0.6].map((delay, i) => (
                                        <span
                                            key={i}
                                            className="block h-1 w-1 rounded-full bg-primary"
                                            style={{
                                                animation: "bounce 1s infinite",
                                                animationDelay: `${delay}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Aguardando o início da prova</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Faltam alguns momentos. Mantenha a calma e prepare-se. A página será
                                    automaticamente liberada quando a prova começar.
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                                <CountTile value={days} label="Dias" />
                                <CountTile value={hours} label="Horas" />
                                <CountTile value={minutes} label="Min" />
                                <CountTile value={seconds} label="Seg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recomendações */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Recomendações importantes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                            <li>Chegue com pelo menos 30 minutos de antecedência.</li>
                            <li>Traga um documento de identificação válido (BI ou Passaporte).</li>
                            <li>Não é permitido o uso de telemóvel durante a prova.</li>
                            <li>Leve esferográfica azul ou preta.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

        );
    }

    // ============ TELA: PROVA SUBMETIDA ============
    if (submitted) {
        return (

            <div className="max-w-2xl mx-auto animate-fade-in">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-10 text-center space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Prova submetida com sucesso!</h2>
                        <p className="text-muted-foreground">
                            Você respondeu <strong>{answeredCount}</strong> de{" "}
                            <strong>{questions.length}</strong> perguntas.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Os resultados serão divulgados na sua área do estudante e por e-mail.
                        </p>
                    </CardContent>
                </Card>
            </div>

        );
    }

    // ============ TELA: PROVA ATIVA ============
    const q = questions[current];
    return (

        <div className="space-y-4 animate-fade-in">
            {/* Cabeçalho fixo da prova */}
            <Card className="sticky top-16 z-10">
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg font-bold">Prova de Admissão</h1>
                        <p className="text-sm text-muted-foreground">{examInfo.candidate} — {examInfo.course}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Tempo restante</p>
                            <p className="text-xl font-mono font-bold text-primary">{formatClock(remaining)}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                            {answeredCount}/{questions.length} respondidas
                        </Badge>
                    </div>
                </CardContent>
                <Progress value={progress} className="h-1 rounded-none" />
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                {/* Pergunta atual */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Badge variant="outline">{q.subject}</Badge>
                            <span className="text-sm text-muted-foreground">
                                Pergunta {current + 1} de {questions.length}
                            </span>
                        </div>
                        <CardTitle className="text-xl pt-2">{q.statement}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={answers[q.id] ?? ""}
                            onValueChange={(v: string) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                            className="space-y-3"
                        >
                            {q.options.map((opt, idx) => {
                                const id = `q${q.id}-opt${idx}`;
                                const selected = answers[q.id] === opt;
                                return (
                                    <Label
                                        key={id}
                                        htmlFor={id}
                                        className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent ${selected ? "border-primary bg-primary/5" : ""
                                            }`}
                                    >
                                        <RadioGroupItem value={opt} id={id} />
                                        <span className="text-base font-normal">
                                            <span className="font-semibold mr-2">
                                                {String.fromCharCode(65 + idx)}.
                                            </span>
                                            {opt}
                                        </span>
                                    </Label>
                                );
                            })}
                        </RadioGroup>

                        <div className="flex items-center justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                                disabled={current === 0}
                            >
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                            {current === questions.length - 1 ? (
                                <Button onClick={handleSubmit}>
                                    <Send className="h-4 w-4" /> Submeter Prova
                                </Button>
                            ) : (
                                <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                                    Próxima <ChevronRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Painel de navegação */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-base">Navegação</CardTitle>
                        <CardDescription>Clique numa pergunta para ir até ela.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((qq, idx) => {
                                const isAnswered = !!answers[qq.id];
                                const isCurrent = idx === current;
                                return (
                                    <button
                                        key={qq.id}
                                        onClick={() => setCurrent(idx)}
                                        className={`h-10 w-10 rounded-md border text-sm font-semibold transition-all ${isCurrent
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : isAnswered
                                                ? "border-primary/50 bg-primary/10 text-primary"
                                                : "border-input bg-background hover:bg-accent"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <Separator className="my-4" />
                        <Button className="w-full" onClick={handleSubmit}>
                            <Send className="h-4 w-4" /> Submeter Prova
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
};

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-lg border p-4 bg-card">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-1">
                {icon}
                {label}
            </div>
            <p className="text-base font-semibold">{value}</p>
        </div>
    );
}

function CountTile({ value, label }: { value: number; label: string }) {
    return (
        <div className="min-w-[64px] rounded-lg border bg-card px-3 py-3 sm:px-4 sm:py-4 shadow-sm">
            <p className="text-3xl sm:text-4xl font-bold tabular-nums text-primary">
                {String(value).padStart(2, "0")}
            </p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{label}</p>
        </div>
    );
}

export default ProvaExameAcesso;