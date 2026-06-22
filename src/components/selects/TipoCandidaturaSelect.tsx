import { useQueryTipoCandidatura } from "@/hooks/dropdowns/use-query-tipo-candidatura";
import { useId, useMemo } from "react";
import { FormCommandSelect } from "./FormCommandSelect";


interface TipoCandidaturaProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  isPostGraduation?: boolean;
  label?: string;
}

export function TipoCandidaturaSelect({
  value,
  onChangeValue,
  disabled,
  enableDefaultSelectItem,
  isPostGraduation = false,
  label = "Tipo de Candidatura",
}: TipoCandidaturaProps) {
  const id = useId();
  const defaultSelectItem = enableDefaultSelectItem
    ? [
      {
        label: "Todos",
        value: "all",
        key: id,
      },
    ]
    : undefined;

  const { data: tiposCandidatura = [], isLoading } = useQueryTipoCandidatura();
  const tiposCandidaturaPostGraduation = useMemo(() => {
    return tiposCandidatura.filter((tipo) => tipo.codigo !== 1);
  }, [tiposCandidatura]);
  return (
    <FormCommandSelect
      disabled={isLoading || disabled}
      label={label}
      isLoading={isLoading}
      defaultSelectItem={defaultSelectItem}
      value={value}
      onChange={(v) => onChangeValue(v)}
      options={isPostGraduation ? tiposCandidaturaPostGraduation : tiposCandidatura}
      map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
    />
  );
}
