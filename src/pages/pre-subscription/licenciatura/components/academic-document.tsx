import { useCursos } from '@/hooks/dropdowns/use-query-cursos'
import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryPeriod } from '@/hooks/dropdowns/use-query-period'
import { usePoloDropdown } from '@/hooks/dropdowns/use-query-polo'
import { FileInput } from '@/components/input-file'
import { FacultySelect } from '@/components/selects/FacultySelect'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useQueryUser } from '@/hooks/candidate/use-query-user'
import { useQueryFetchFaculdades } from '@/hooks/faculdade/use-query-faculdade'
import { useEffect } from 'react'

export function AcademicDocument() {
  const { profileData } = useQueryProfile()
  const { data: user } = useQueryUser()
  const { data: faculdades } = useQueryFetchFaculdades()
  const { form } = useFormPreSubscriptionForm()

  // Preenche polo, curso pretendido e turno a partir do perfil,
  // caso já existam no registo do candidato.
  useEffect(() => {
    if (!profileData) return

    if (profileData.poloid && !form.getValues('pole')) {
      form.setValue('pole', String(profileData.poloid), {
        shouldValidate: false,
        shouldDirty: false,
      })
    }

    if (profileData.curso_candidatura && !form.getValues('intendedCourse')) {
      form.setValue('intendedCourse', String(profileData.curso_candidatura), {
        shouldValidate: false,
        shouldDirty: false,
      })
    }

    if (profileData.periodoid && !form.getValues('period')) {
      form.setValue('period', String(profileData.periodoid), {
        shouldValidate: false,
        shouldDirty: false,
      })
    }
  }, [profileData, form])

  // Preenche a faculdade a partir do user (beginning-student-process),
  // casando por designação ou código com a lista de faculdades.
  useEffect(() => {
    if (!user?.faculdade) return
    if (form.getValues('faculty')) return
    if (!faculdades?.length) return

    const normalized = String(user.faculdade).trim().toLowerCase()
    const match = faculdades.find(
      (f) =>
        String(f.codigo).toLowerCase() === normalized ||
        f.designacao.trim().toLowerCase() === normalized,
    )

    if (match) {
      form.setValue('faculty', match.codigo, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [user, faculdades, form])

  const faculdadeId = form.watch('faculty')
  const { data: courses } = useCursos({
    faculdadeId,
    tipoCandidaturaId: profileData?.codigo_tipo_candidatura ?? 1,
  })

  //OPCIONAIS

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SelectFormField
          placeholder="Selecione Polo"
          control={form.control}
          fullWidth
          name="pole"
          label="Polo"
          items={poloOptions.filter((p) => p.value !== '3' && p.value !== '4')}
        />

        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FacultySelect
                  value={field.value?.toString()}
                  onChangeValue={(v) => field.onChange(parseInt(v))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectFormField
          name="intendedCourse"
          placeholder="Selecione Curso"
          control={form.control}
          fullWidth
          label="Curso Pretendido"
          items={courseOptions}
          disabled={!faculdadeId}
        />

        <SelectFormField
          name="intendedCourseSecond"
          placeholder="Selecione Curso"
          control={form.control}
          fullWidth
          label="2º Opção (Opcional)"
          items={courseOptions}
          disabled={!faculdadeId}
        />
        <SelectFormField
          placeholder="Selecione Curso"
          name="intendedCourseThird"
          control={form.control}
          fullWidth
          label="3º Opção (Opcional)"
          items={courseOptions}
          disabled={!faculdadeId}
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
          label="Já fez prova na pública e teve positiva?"
          items={natureInscriptionOptions}
        />

        {camePublicUniversity === '1' && (
          <FileInput
            label="Anexa a pauta da pública"
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
