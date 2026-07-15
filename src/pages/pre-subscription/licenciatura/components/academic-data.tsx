import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
import { FileInput } from '@/components/input-file'
import { useQueryUser } from '@/hooks/candidate/use-query-user'
import { useEffect, useMemo } from 'react'

export function AcademicData() {
  const { form } = useFormPreSubscriptionForm()
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()
  const { data: user } = useQueryUser()

  const tipoCandidaturaOptions = useMemo(
    () =>
      tipoCandidaturas?.map((t) => ({
        label: t.designacao,
        value: String(t.codigo).trim(),
      })) ?? [],
    [tipoCandidaturas],
  )

  useEffect(() => {
    if (!user) return
    if (!user.grauacademico) return
    if (form.getValues('typeGraduation')) return
    if (!tipoCandidaturas?.length) return // espera a lista chegar para poder resolver o código

    // user.grauacademico vem como texto ("Licenciatura", "Doutoramento"...),
    // mas o form/Select trabalha com o código (t.codigo). Por isso
    // precisamos de encontrar o item cuja designação corresponde ao texto.
    const match = tipoCandidaturas.find(
      (t) =>
        t.designacao.trim().toLowerCase() ===
        String(user.grauacademico).trim().toLowerCase(),
    )

    if (match) {
      form.setValue('typeGraduation', String(match.codigo).trim(), {
        shouldValidate: true,
        shouldDirty: false,
      })
    } else {
      console.warn(
        '[AcademicData] grauacademico do user não corresponde a nenhuma opção:',
        { grauacademico: user.grauacademico, tipoCandidaturas },
      )
    }
  }, [user, tipoCandidaturas, form])

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
        <InputFormField
          label="Media Final"
          control={form.control}
          name="averageGrade"
          placeholder="16.5"
          type="number"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFormField
          control={form.control}
          name="typeGraduation"
          label="Tipo de Candidatura"
          placeholder="Selecione"
          items={tipoCandidaturaOptions}
          fullWidth
          disabled
        />
        <FileInput
          label="Certificado"
          required
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
