import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'
import { FileInput } from '@/components/input-file'
import { useEffect } from 'react'
import { NumberInputFormField } from '@/components/input-form-field/NumberInputFormField'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'

export function AcademicData() {
  const { form } = useFormPreSubscriptionForm()
  const { profileData } = useQueryProfile()

  // Preenche a média final e os dados de formação a partir do perfil,
  // caso já existam no registo do candidato.
  useEffect(() => {
    if (!profileData) return

    if (profileData.media_final && !form.getValues('averageGrade')) {
      form.setValue('averageGrade', String(profileData.media_final), {
        shouldValidate: false,
        shouldDirty: false,
      })
    }

    if (profileData.instituicao_formacao && !form.getValues('previousSchool')) {
      form.setValue('previousSchool', profileData.instituicao_formacao, {
        shouldValidate: false,
        shouldDirty: false,
      })
    }

    if (profileData.data_conclusao && !form.getValues('graduationYear')) {
      form.setValue(
        'graduationYear',
        profileData.data_conclusao.split('T')[0],
        {
          shouldValidate: false,
          shouldDirty: false,
        },
      )
    }
  }, [profileData, form])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          label="Instituição de Ensino"
          control={form.control}
          name="previousSchool"
          placeholder="Nome da escola"
          type="text"
        />

        <InputFormField
          label="Curso do Ensino Médio"
          control={form.control}
          name="previousCourse"
          placeholder="Nome do curso"
          type="text"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          label="Ano de Conclusão"
          control={form.control}
          name="graduationYear"
          placeholder="2024"
          type="date"
        />
        <NumberInputFormField
          label="Media Final"
          control={form.control}
          name="averageGrade"
          placeholder="16.5"
          min={10}
          max={20}
          step={0.1}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileInput
          label="Certificado"
          accept=".pdf"
          maxSizeMB={5}
          error={form.formState.errors.certificate?.message}
          onChange={(file) =>
            form.setValue('certificate', file!, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      </div>
    </>
  )
}
