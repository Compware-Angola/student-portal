import { Badge } from "@/components/ui/badge";

const GRAU_MAP: Record<string, { label: string; className: string }> = {
  LIC: {
    label: "Licenciatura",
    className: "border-sky-200 text-sky-700 dark:border-sky-800 dark:text-sky-400",
  },
  MST: {
    label: "Mestrado",
    className: "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400",
  },
  DTR: {
    label: "Doutoramento",
    className: "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400",
  },
};

export function getGrauBadge(entity: any, size: "sm" | "default" = "default") {
  const sigla = (entity?.sigla_tipo_candidatura || "").toUpperCase();
  const grau = GRAU_MAP[sigla];
  if (!grau) return null;

  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs font-medium";

  return (
    <Badge variant="outline" className={`${grau.className} ${sizeClass}`}>
      {grau.label}
    </Badge>
  );
}