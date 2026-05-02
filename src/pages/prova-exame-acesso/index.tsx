import { useState, useEffect, useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";

import {

    CheckCircle2

} from "lucide-react";
import { toast } from "sonner";
import AcessoBloqueado from "./components/block-info";
import WaitingTest from "./components/waiting-test";
import Questions from "./components/questions";

// ====== Configuração da Prova ======
// Para testar a tela de prova ativa, troque a data abaixo para o passado
// ex: new Date(Date.now() - 1000) — ou ajuste FORCE_EXAM_OPEN para true.
const EXAM_DATE = new Date("2026-05-02T11:27:47");
const EXAM_DURATION_MIN = 120;
const FORCE_EXAM_OPEN = false;

// ====== Verificação de Rede ======
// Em produção, esta verificação seria feita pelo backend (IP da instituição,
// rede Wi-Fi autorizada, geofencing GPS, etc). Aqui simulamos o estado.
// Altere para `true` para testar a tela de bloqueio.
const FORCE_OFF_CAMPUS = false;
const INSTITUTION_NAME = "Universidade Metodista de Angola";
const INSTITUTION_WIFI = "UMA-CAMPUS";

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
    const offCampus = FORCE_OFF_CAMPUS;

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

    if (offCampus) {
        return <AcessoBloqueado INSTITUTION_WIFI={INSTITUTION_WIFI} INSTITUTION_NAME={INSTITUTION_NAME} />
    }

    if (!examOpen) {
        return <WaitingTest days={days} hours={hours} minutes={minutes} seconds={seconds} examInfo={examInfo} EXAM_DATE={EXAM_DATE} />
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
    return (

        <Questions current={current} setCurrent={setCurrent} questions={questions} answers={answers} setAnswers={setAnswers} answeredCount={answeredCount} progress={progress} remaining={remaining} formatClock={formatClock} handleSubmit={handleSubmit} examInfo={examInfo} />

    );
};



export default ProvaExameAcesso;