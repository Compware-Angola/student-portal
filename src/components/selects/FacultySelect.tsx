import { useQueryFetchFaculdades } from "@/hooks/faculdade/use-query-faculdade";
import { useEffect, useState } from "react";
import type { Faculdade } from "@/services/faculdade/fetch-faculdade.service";
import { FormCommandSelect } from "./FormCommandSelect";
interface FacultySelectProps {
  value: string;
  showLabel?: boolean;
  onChangeValue: (v: string) => void;
  allOption?: boolean;
  width?: string;
  placeholder?: string;
}
const FacultySelect = ({
  onChangeValue,
  value,
  allOption = false,
  showLabel = true,
  placeholder,
  width = "full",
}: FacultySelectProps) => {
  const { data: faculdades = [], isLoading: isLoadingFaculdades } =
    useQueryFetchFaculdades();
  const [allfaculdades, setAllFaculdades] = useState<Faculdade[]>([]);

  useEffect(() => {
    if (allOption) {
      setAllFaculdades([
        {
          codigo: "all",
          designacao: "Todos",
        } as unknown as Faculdade,
        ...faculdades,
      ]);
    } else {
      setAllFaculdades(faculdades);
    }
  }, [allOption, faculdades]);

  return (
    <>
      <FormCommandSelect
        disabled={isLoadingFaculdades}
        placeholder={placeholder}
        value={value}
        label={showLabel ? "Faculdade" : undefined}
        width={width}
        options={allfaculdades}
        map={(f) => ({
          key: f.codigo.toString(),
          value: f.codigo.toString(),
          label: f.designacao,
        })}
        onChange={(value) => onChangeValue(value)}
      />
    </>
  );
};

export { FacultySelect };
