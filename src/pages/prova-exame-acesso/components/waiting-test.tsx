import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryInfoGeraisCandidatura } from "@/hooks/pre-registation/use-query-info-gerais-candidatura";
import { useQueryProfile } from "@/hooks/profile/use-query-profile";
import { fmt } from "@/utils/fmt";
import { Separator } from "@radix-ui/react-separator";
import { AlertCircle, BookOpen, Calendar, Clock, FileText, Hourglass, MapPin, User, } from "lucide-react";
interface WaitingTestProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    examInfo: any;

}
function WaitingTest({ days, hours, minutes, seconds, examInfo }: WaitingTestProps) {
    const { data: info } = useQueryInfoGeraisCandidatura()
  const { profileData } = useQueryProfile()
    const candidate = info?.nome_completo
    const course = profileData?.curso_candidatura_designacao
    const examDate = info?.data_prova ?? undefined
    const horario = `${fmt(info?.hora_inicio)} - ${fmt(info?.hora_fim)}`
    const examOptions = info?.lista_de_provas ?? []
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
                        <InfoTile icon={<User className="h-5 w-5" />} label="Candidato" value={fmt(candidate)} />
                        <InfoTile icon={<BookOpen className="h-5 w-5" />} label="Curso" value={fmt(course)} />
                        <InfoTile
                            icon={<Calendar className="h-5 w-5" />}
                            label="Data"
                            value={fmt(examDate)}
                        />
                        <InfoTile icon={<Clock className="h-5 w-5" />} label="Horário" value={horario} />
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
                                {examOptions.map((s: any) => (
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

export default WaitingTest;