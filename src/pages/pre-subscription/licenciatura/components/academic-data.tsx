import { InputFormField } from '@/components/input-form-field'
import { useFormPreSubscriptionForm } from './form-provider'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
import { FileInput } from '@/components/input-file'
import { useQueryUser } from '@/hooks/candidate/use-query-user'
import { useEffect, useMemo } from 'react'
import { NumberInputFormField } from '@/components/input-form-field/NumberInputFormField'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'
import { useQueryUsableAcademicYear } from '@/hooks/academic-year/use-query-usable-academic-year'
import type { PrazoResponse } from '@/services/prazos'

export function AcademicData() {
  const { form } = useFormPreSubscriptionForm()
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()
  const { data: user } = useQueryUser()
  const { profileData } = useQueryProfile()

  // Prazos de inscrição de novos estudantes por tipo de candidatura
  const { data: anoLicenciatura } = useQueryUsableAcademicYear(1)
  const { data: anoMestrado } = useQueryUsableAcademicYear(2)
  const { data: anoDoutoramento } = useQueryUsableAcademicYear(3)

  const { data: prazoLicenciatura } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 1,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoLicenciatura?.codigo,
    },
    Boolean(anoLicenciatura?.codigo),
  )
  const { data: prazoMestrado } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 2,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoMestrado?.codigo,
    },
    Boolean(anoMestrado?.codigo),
  )
  const { data: prazoDoutoramento } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 3,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoDoutoramento?.codigo,
    },
    Boolean(anoDoutoramento?.codigo),
  )

  const prazosPorCandidatura: Record<number, PrazoResponse | undefined> = {
    1: prazoLicenciatura,
    2: prazoMestrado,
    3: prazoDoutoramento,
  }

  // Apenas tipos de candidatura com prazo de inscrição aberto
  const tiposComPrazo = useMemo(
    () =>
      tipoCandidaturas?.filter(
        (t) =>
          prazosPorCandidatura[Number(String(t.codigo).trim())]
            ?.podeInscrever === true,
      ) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tipoCandidaturas, prazoLicenciatura, prazoMestrado, prazoDoutoramento],
  )

  console.log(user)
  const tipoCandidaturaOptions = useMemo(
    () =>
      tiposComPrazo.map((t) => ({
        label: t.designacao,
        value: String(t.codigo).trim(),
      })) ?? [],
    [tiposComPrazo],
  )

  useEffect(() => {
    if (!user) return
    if (!user.grauacademico) return
    if (form.getValues('typeGraduation')) return
    if (!tiposComPrazo.length) return // espera a lista chegar para poder resolver o código

    // user.grauacademico vem como texto ("Licenciatura", "Doutoramento"...),
    // mas o form/Select trabalha com o código (t.codigo). Por isso
    // precisamos de encontrar o item cuja designação corresponde ao texto.
    const match = tiposComPrazo.find(
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
        { grauacademico: user.grauacademico, tipoCandidaturas: tiposComPrazo },
      )
    }
  }, [user, tiposComPrazo, form])

  // Preenche o tipo de candidatura e a média final a partir do perfil,
  // caso já existam no registo do candidato.
  useEffect(() => {
    if (!profileData) return

    if (
      profileData.codigo_tipo_candidatura &&
      !form.getValues('typeGraduation') &&
      tiposComPrazo.some(
        (t) =>
          String(t.codigo).trim() ===
          String(profileData.codigo_tipo_candidatura).trim(),
      )
    ) {
      form.setValue(
        'typeGraduation',
        String(profileData.codigo_tipo_candidatura).trim(),
        { shouldValidate: false, shouldDirty: false },
      )
    }

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
  }, [profileData, tiposComPrazo, form])

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
        <SelectFormField
          control={form.control}
          name="typeGraduation"
          label="Tipo de Candidatura"
          placeholder="Selecione"
          items={tipoCandidaturaOptions}
          fullWidth
        />
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
