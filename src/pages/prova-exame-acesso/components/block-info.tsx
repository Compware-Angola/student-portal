import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { AlertCircle, Lock, MapPinOff, ShieldAlert, Wifi } from "lucide-react";

// Keyframes injectados uma vez no <head>
const injectKeyframes = () => {
    if (document.getElementById("ab-keyframes")) return;
    const style = document.createElement("style");
    style.id = "ab-keyframes";
    style.textContent = `
    @keyframes ab-sand-fall {
      0%   { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes ab-ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    @keyframes ab-ping2 {
      75%, 100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes ab-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }
    @keyframes ab-fade-in {
      from { opacity: 0; transform: scale(0.8); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
    document.head.appendChild(style);
};

function AcessoBloqueado({
    INSTITUTION_WIFI,
    INSTITUTION_NAME,
}: {
    INSTITUTION_WIFI: string;
    INSTITUTION_NAME: string;
}) {
    injectKeyframes();

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden border-l-4 border-l-destructive">
                <CardContent className="p-0">

                    {/* Faixa superior animada */}
                    <div
                        className="h-2"
                        style={{
                            background: "linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)",
                            backgroundSize: "200% 100%",
                            animation: "ab-sand-fall 2s linear infinite",
                        }}
                    />

                    <div className="p-8 sm:p-10 text-center space-y-6">

                        {/* Ícone animado de bloqueio */}
                        <div className="relative mx-auto w-32 h-32">
                            {/* Anéis pulsantes */}
                            <span
                                className="absolute inset-0 rounded-full bg-destructive/20"
                                style={{ animation: "ab-ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
                            />
                            <span
                                className="absolute inset-2 rounded-full bg-destructive/15"
                                style={{ animation: "ab-ping2 1.5s cubic-bezier(0,0,0.2,1) infinite", animationDelay: "0.4s" }}
                            />
                            <span
                                className="absolute inset-4 rounded-full bg-destructive/10"
                                style={{ animation: "ab-pulse 2s ease-in-out infinite" }}
                            />

                            {/* Cadeado central */}
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center shadow-xl">
                                <Lock className="h-14 w-14 text-destructive-foreground drop-shadow" strokeWidth={2.2} />
                            </div>

                            {/* Wifi cortado (badge flutuante) */}
                            <div
                                className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-card border-2 border-destructive flex items-center justify-center shadow-lg"
                                style={{ animation: "ab-fade-in 0.6s ease-out" }}
                            >
                                <div className="relative">
                                    <Wifi className="h-6 w-6 text-destructive" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-7 w-0.5 bg-destructive rotate-45 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Badge variant="destructive" className="gap-1">
                                <ShieldAlert className="h-3.5 w-3.5" />
                                Acesso Bloqueado
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                Você está fora da instituição
                            </h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Por motivos de segurança, a prova só pode ser realizada{" "}
                                <strong>dentro do campus</strong> da{" "}
                                <strong>{INSTITUTION_NAME}</strong>, conectado à rede oficial.
                            </p>
                        </div>

                        {/* Tiles de status */}
                        <div className="grid gap-3 sm:grid-cols-3 text-left">
                            <StatusTile icon={<MapPinOff className="h-5 w-5" />} label="Localização" value="Fora do campus" status="error" />
                            <StatusTile icon={<Wifi className="h-5 w-5" />} label="Rede Wi-Fi" value={`Não conectado a ${INSTITUTION_WIFI}`} status="error" />
                            <StatusTile icon={<ShieldAlert className="h-5 w-5" />} label="Verificação" value="Falhou" status="error" />
                        </div>

                        <Separator />

                        <div className="rounded-lg bg-muted/40 border p-4 text-left text-sm space-y-2">
                            <p className="font-semibold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                O que fazer agora?
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Dirija-se ao campus da instituição.</li>
                                <li>Conecte-se à rede oficial <strong>{INSTITUTION_WIFI}</strong>.</li>
                                <li>Atualize esta página para tentar novamente.</li>
                                <li>Em caso de dúvidas, contacte o suporte académico.</li>
                            </ul>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                <Wifi className="h-4 w-4" /> Verificar novamente
                            </Button>
                            <Button onClick={() => (window.location.href = "/suporte")}>
                                Contactar Suporte
                            </Button>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusTile({
    icon, label, value, status,
}: {
    icon: React.ReactNode; label: string; value: string; status: "ok" | "error";
}) {
    const isError = status === "error";
    return (
        <div className={`rounded-lg border p-4 ${isError ? "border-destructive/40 bg-destructive/5" : "border-success/40 bg-success/5"}`}>
            <div className={`flex items-center gap-2 text-xs uppercase tracking-wide mb-1 ${isError ? "text-destructive" : "text-success"}`}>
                {icon} {label}
            </div>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    );
}

export default AcessoBloqueado;