import { useCursos } from '@/hooks/dropdowns/use-query-cursos'
import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryPeriod } from '@/hooks/dropdowns/use-query-period'
import { usePoloDropdown } from '@/hooks/dropdowns/use-query-polo'

export function AcademicDocument() {
  const { form } = useFormPreSubscriptionForm()
  //OPCIONAIS
  const { data: courses } = useCursos()

  const courseOptions =
    courses?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  const { data: periods } = useQueryPeriod()
  const periodOptions =
    periods?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  const {data: polos } = usePoloDropdown()
  const poloOptions = polos?.map((t) => ({
      label: t.designacao,
      value: String(t.id),
    })) ?? []

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SelectFormField
          placeholder="Selecione Polo"
          control={form.control}
          fullWidth
          name="pole"
          label="Polo"
          items={poloOptions}
        />
        <SelectFormField
          name="intendedCourse"
          placeholder="Selecione Curso"
          control={form.control}
          fullWidth
          label="Curso Pretendido"
          items={courseOptions}
        />
        <SelectFormField
          name="intendedCourseSecond"
          placeholder="Selecione Curso"
          control={form.control}
          fullWidth
          label="2º Opção (Opcional)"
          items={courseOptions}
        />
        <SelectFormField
          placeholder="Selecione Curso"
          name="intendedCourseThird"
          control={form.control}
          fullWidth
          label="3º Opção (Opcional)"
          items={courseOptions}
        />
        <SelectFormField
          name="period"
          placeholder="Selecione Turno"
          control={form.control}
          fullWidth
          label="Turno"
          items={periodOptions}
        />
        <SelectFormField
          name="periodSecondOption"
          control={form.control}
          placeholder="Selecione Turno"
          fullWidth
          label="Turno Opcional"
          items={periodOptions}
        />
      </div>
    </>
  )
}
