import { useCursos } from '@/hooks/dropdowns/use-query-cursos'
import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryPeriod } from '@/hooks/dropdowns/use-query-period'
import { usePoloDropdown } from '@/hooks/dropdowns/use-query-polo'
import { FileInput } from '@/components/input-file'

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

  const { data: polos } = usePoloDropdown()
  const poloOptions =
    polos?.map((t) => ({
      label: t.designacao,
      value: String(t.id),
    })) ?? []

  const natureInscriptionOptions = [
    { label: 'Sim', value: '1' },
    { label: 'Não', value: '0' },
  ]

  // observa o valor selecionado para renderizar o input condicional
  const camePublicUniversity = form.watch('natureInscription')

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
        <FileInput
          label="Bilhete/Passaporte"
          required
          accept=".pdf"
          maxSizeMB={5}
          error={form.formState.errors.document?.message}
          onChange={(file) =>
            form.setValue('document', file!, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        <SelectFormField
          name="natureInscription"
          control={form.control}
          placeholder="Selecione um valor"
          fullWidth
          label="Veio de uma Universidade Pública?"
          items={natureInscriptionOptions}
        />

        {camePublicUniversity === '1' && (
          <FileInput
            label="Documento Comprovativo"
            required
            accept=".pdf"
            maxSizeMB={5}
            error={
              form.formState.errors.publicUniversityDocument?.message as
                | string
                | undefined
            }
            onChange={(file) =>
              form.setValue('publicUniversityDocument', file!, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        )}
      </div>
    </>
  )
}
