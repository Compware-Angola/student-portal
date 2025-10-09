import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";
type Variant = "red" | "blue" | "yellow" | "green";
interface IStatisticCardProps {
  icon: ReactNode;
  value: string;
  text: string;
  variant: Variant;
}
const VARIANT_COLORS: Record<Variant, string> = {
  red: "bg-[#FF6C84]",
  blue: "bg-[#70B2FF]",
  yellow: "bg-[#FFC97C]",
  green: "bg-[#54DFC3]",
};
export function StatisticCard({
  icon,
  text,
  value,
  variant,
}: IStatisticCardProps) {
  return (
    <>
      <Card
        className={`@container/card rounded-sm shadow-none ${VARIANT_COLORS[variant]}`}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {value}
          </CardTitle>
          <CardAction>{icon}</CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">{text}</div>
        </CardFooter>
      </Card>
    </>
  );
}
