import { useCursos } from '@/hooks/dropdowns/use-query-cursos'
import { useFormPreSubscriptionPostGraduateForm } from './hook'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryPeriod } from '@/hooks/dropdowns/use-query-period'
import { FileInput } from '@/components/input-file'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useEffect, useMemo } from 'react'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
const GRADUATION_TYPE = {
  Mestrado: '2',
  Doutoramento: '3',
} as const

type GraduationKey = keyof typeof GRADUATION_TYPE

export function AcademicDocumentPostGraduate() {
  const { profileData } = useQueryProfile()
  const { form } = useFormPreSubscriptionPostGraduateForm()
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
      tipoCandidaturaId: Number(form.watch('intendedGraduation')),
    },
    Boolean(Number(form.watch('intendedGraduation'))),
  )

  useEffect(() => {
    if (!profileData) return
    form.setValue(
      'intendedGraduation',
      GRADUATION_TYPE[profileData.grau_academico as GraduationKey],
    )
  }, [profileData])

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SelectFormField
        name="intendedGraduation"
        placeholder="Tipo de Candidatura"
        control={form.control}
        fullWidth
        label="Tipo de Candidatura"
        items={tipoCandidaturaOptions}
      />
      <SelectFormField
        name="intendedCourse"
        placeholder="Selecione Curso"
        control={form.control}
        fullWidth
        label="Curso Pretendido"
        disabled={!Boolean(Number(form.watch('intendedGraduation')))}
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
