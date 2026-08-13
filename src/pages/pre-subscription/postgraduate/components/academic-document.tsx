import { useCursos } from '@/hooks/dropdowns/use-query-cursos'
import { useFormPreSubscriptionPostGraduateForm } from './hook'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryPeriod } from '@/hooks/dropdowns/use-query-period'
import { FileInput } from '@/components/input-file'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useEffect, useMemo } from 'react'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FacultySelect } from '@/components/selects/FacultySelect'
import { usePoloDropdown } from '@/hooks/dropdowns/use-query-polo'
const GRADUATION_TYPE = {
  Mestrado: '2',
  Doutoramento: '3',
} as const

type GraduationKey = keyof typeof GRADUATION_TYPE

export function AcademicDocumentPostGraduate() {
  const { profileData } = useQueryProfile()
  const { form } = useFormPreSubscriptionPostGraduateForm()
   const faculdadeId = form.watch('faculty')
  const graduationKey = profileData?.grau_academico as GraduationKey | undefined
  const graduationTypeValue = graduationKey
    ? GRADUATION_TYPE[graduationKey]
    : null
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()
  const tipoCandidaturaOptions = useMemo(() => {
    if (!tipoCandidaturas) return []

    return tipoCandidaturas
      .filter((t) => String(t.codigo) === graduationTypeValue)
      .map((t) => ({
        label: t.designacao,
        value: String(t.codigo),
      }))
  }, [tipoCandidaturas, graduationTypeValue])

  const { data: courses } = useCursos(
    {
      faculdadeId: faculdadeId,
      tipoCandidaturaId: Number(form.watch('intendedGraduation')),
    },
    Boolean(Number(form.watch('intendedGraduation'))),
  )

  useEffect(() => {
    if (!profileData || !graduationTypeValue) return
    form.setValue('intendedGraduation', graduationTypeValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [profileData, graduationTypeValue])

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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
       <SelectFormField
          placeholder="Selecione Polo"
          control={form.control}
          fullWidth
          name="pole"
          label="Polo"
          items={poloOptions.filter((p) => p.value !== "3" && p.value !== "4")}
        />
      <SelectFormField
        name="intendedGraduation"
        placeholder="Tipo de Candidatura"
        control={form.control}
        fullWidth
        disabled
        label="Tipo de Candidatura"
        items={tipoCandidaturaOptions}
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
        disabled={!Number(form.watch('intendedGraduation'))}
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
      <FileInput
        label="Certificado/Declaracao"
        required
        accept=".pdf"
        maxSizeMB={5}
        error={form.formState.errors.certificateOrDeclaration?.message}
        onChange={(file) =>
          form.setValue('certificateOrDeclaration', file!, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <FileInput
        label="Curriculum Vitae"
        required
        accept=".pdf"
        maxSizeMB={5}
        error={form.formState.errors.curriculumVitae?.message}
        onChange={(file) =>
          form.setValue('curriculumVitae', file!, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <FileInput
        label="Projecto de investigacao cientifica"
        required
        accept=".pdf"
        maxSizeMB={5}
        error={form.formState.errors.scientificInvestigationProject?.message}
        onChange={(file) =>
          form.setValue('scientificInvestigationProject', file!, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
    </div>
  )
}
