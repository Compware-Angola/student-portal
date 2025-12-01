
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ModeToggle } from "@/components/mode-toggle";
import { Key, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { LogoBackground } from "./logo-background";
import { resetPassword } from "@/services/auth/login.service";


export default function RenovarSenha() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    novaSenha: "",
    repetirSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.novaSenha !== formData.repetirSenha) {
      toast.error("As senhas não coincidem", {
        description: "Verifique os dois campos e tente novamente",
      });
      return;
    }

    if (formData.novaSenha.length < 8) {
      toast.error("Senha muito curta", {
        description: "A senha deve ter no mínimo 8 caracteres",
      });
      return;
    }

    setLoading(true);

    try {
     await resetPassword(token!, formData.novaSenha);
    } catch (err: any) {
      toast.error("Erro ao renovar senha", {
        description: err.message || "Tente solicitar um novo link de recuperação",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-gradient-to-br from-background to-muted p-4">
      {/* Fundo decorativo */}
      <LogoBackground top="2.5rem" right="2.5rem" />
      <LogoBackground bottom="2.5rem" left="2.5rem" />

      <Card className="w-full max-w-md relative z-10">
        {/* Botão de tema */}
        <div className="absolute right-4 top-4 z-10">
          <ModeToggle />
        </div>

        <CardHeader className="space-y-6 text-center">
          <div className="flex justify-center">
            <img
              src="/logo_uma.webp"
              alt="Universidade Metodista de Angola"
              className="h-24 w-auto"
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Key className="h-6 w-6 text-primary" />
              Renovar Senha
            </CardTitle>
            <CardDescription>
              Crie uma nova senha segura para acessar sua conta
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  minLength={8}
                />
              </div>
            </div>

            {/* Repetir Senha */}
            <div className="space-y-2">
              <Label htmlFor="repetirSenha">Repetir Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="repetirSenha"
                  name="repetirSenha"
                  type="password"
                  placeholder="Digite novamente"
                  value={formData.repetirSenha}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {/* Botão principal */}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>Processando...</>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Confirmar Nova Senha
                </>
              )}
            </Button>

            {/* Voltar ao login */}
            <div className="text-center pt-4">
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Voltar para o login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}