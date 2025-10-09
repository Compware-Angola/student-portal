import {
  BadgeCheck,
  BookOpen,
  Calendar,
  CircleDollarSign,
  CreditCard,
  GraduationCap,
  HeartHandshake,
  Info,
  Plus,
  ShieldAlertIcon,
} from "lucide-react";
import { StatisticCard } from "./components/statistic-card";
import { DashAction } from "./components/dash-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function Dashboard() {
  return (
    <>
      <div className="grid auto-rows-min gap-2 md:grid-cols-4">
        <StatisticCard
          value="3.75"
          text="GPA Actual"
          variant="green"
          icon={<GraduationCap />}
        />
        <StatisticCard
          value="45"
          text="Créditos Concluidos"
          variant="yellow"
          icon={<BookOpen />}
        />
        <StatisticCard
          value="AOA125.500"
          text="Divida Pendente"
          variant="blue"
          icon={<Info />}
        />
        <StatisticCard
          value="6º"
          text="Semestre Actual"
          variant="red"
          icon={<Calendar />}
        />
      </div>

      <div className="mt-4">
        <h4 className="scroll-m-20 text-base font-medium tracking-tight mb-2">
          Ações Rápidas
        </h4>
        <div className="grid auto-rows-min gap-2 md:grid-cols-4">
          <DashAction
            icon={<CreditCard className="w-12 text-[#5097FF] font-medium" />}
            title="Ver Finanças"
            content="Consulte suas dividas e histórico de pagamentos"
          />
          <DashAction
            icon={<Plus className="w-12 text-[#4eca83] font-medium" />}
            title="Nova Matricula"
            content="Matricule-se em novas disciplinas"
          />
          <DashAction
            icon={<CircleDollarSign className="w-12 text-[#f25c49]" />}
            title="Pagamento Antecipado"
            content="Pague antecipadamente e ganhe desconto"
          />
          <DashAction
            icon={<HeartHandshake className="w-12 text-[#F44769]" />}
            title="Renegociar Divida"
            content="Negocie suas pendências"
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid gap-2 md:grid-cols-2 ">
          <Card className="shadow-none rounded-md">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex w-full max-w-lg flex-col gap-6">
                <Item>
                  <ItemMedia variant="icon">
                    <BadgeCheck />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Mátricula em Cálculo II confirmada</ItemTitle>
                    <ItemDescription>Há 1 dia</ItemDescription>
                  </ItemContent>
                  <ItemActions></ItemActions>
                </Item>
              </div>
              <div className="flex w-full max-w-lg flex-col gap-6">
                <Item>
                  <ItemMedia variant="icon">
                    <ShieldAlertIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Pagamento de AOA 45.000 Vencido</ItemTitle>
                    <ItemDescription>Há 1 dia</ItemDescription>
                  </ItemContent>
                  <ItemActions></ItemActions>
                </Item>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none rounded-md">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Eventos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex w-full max-w-lg flex-col gap-6">
                <Item>
                  <ItemMedia variant="icon">
                    <Calendar />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Prova de Física </ItemTitle>
                    <ItemDescription>15 de Setembro</ItemDescription>
                  </ItemContent>
                  <ItemActions></ItemActions>
                </Item>
              </div>
              <div className="flex w-full max-w-lg flex-col gap-6">
                <Item>
                  <ItemMedia variant="icon">
                    <Calendar />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Inicio das Matrículas</ItemTitle>
                    <ItemDescription>29 de Setembro</ItemDescription>
                  </ItemContent>
                  <ItemActions></ItemActions>
                </Item>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
