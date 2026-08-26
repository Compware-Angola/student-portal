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
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'
import { useQueryUsableAcademicYear } from '@/hooks/academic-year/use-query-usable-academic-year'
import type { PrazoResponse } from '@/services/prazos'
import { useEffect, useMemo, useRef } from 'react'

export function AcademicDocument() {
  const { profileData } = useQueryProfile()
  const { data: user } = useQueryUser()
  const { data: faculdades } = useQueryFetchFaculdades()
  const { form } = useFormPreSubscriptionForm()
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()

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

  const tipoCandidaturaOptions = useMemo(
    () =>
      tiposComPrazo.map((t) => ({
        label: t.designacao,
        value: String(t.codigo).trim(),
      })) ?? [],
    [tiposComPrazo],
  )

  // Candidato de licenciatura fica fixo nesse tipo de candidatura.
  const isLicenciatura = profileData?.grau_academico === 'Licenciatura'

  const licenciaturaOption = useMemo(
    () =>
      tipoCandidaturaOptions.find(
        (o) => o.label.trim().toLowerCase() === 'licenciatura',
      ),
    [tipoCandidaturaOptions],
  )

  // Preenche o tipo de candidatura a partir do perfil ou do grau académico
  // do candidato, caso já existam no registo.
  useEffect(() => {
    if (!user) return
    if (!user.grauacademico) return
    if (form.getValues('typeGraduation')) return
    if (!tiposComPrazo.length) return // espera a lista chegar para poder resolver o código

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
    }
  }, [user, tiposComPrazo, form])

  // Para licenciatura, fixa o tipo de candidatura em "Licenciatura".
  useEffect(() => {
    if (!isLicenciatura) return
    if (!licenciaturaOption) return
    if (form.getValues('typeGraduation') === licenciaturaOption.value) return

    form.setValue('typeGraduation', licenciaturaOption.value, {
      shouldValidate: true,
      shouldDirty: false,
    })
  }, [isLicenciatura, licenciaturaOption, form])

  useEffect(() => {
    if (!profileData) return
    if (isLicenciatura) return

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
  }, [profileData, isLicenciatura, tiposComPrazo, form])

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
  const periodo = form.watch('period')
  const tipoCandidatura = form.watch('typeGraduation')
  const tipoCandidaturaId = tipoCandidatura
    ? Number(tipoCandidatura)
    : (profileData?.codigo_tipo_candidatura ?? 1)

  const { data: anoLectivo } = useQueryCurrentAcademicYear(
    tipoCandidaturaId === 2 ? 2 : tipoCandidaturaId === 3 ? 3 : 1,
  )

  const { data: courses } = useCursos({
    faculdadeId,
    tipoCandidaturaId,
    anoLectivo: anoLectivo?.codigo ?? 1,
    periodo: Number(periodo),
  })

  //OPCIONAIS

  const courseOptions =
    courses?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  // Reseta os campos de curso sempre que um filtro relevante mudar
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    form.resetField('intendedCourse')
    form.resetField('intendedCourseSecond')
    form.resetField('intendedCourseThird')
  }, [faculdadeId, periodo, tipoCandidaturaId, anoLectivo?.codigo])

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

        <SelectFormField
          control={form.control}
          name="typeGraduation"
          label="Tipo de Candidatura"
          placeholder="Selecione"
          items={tipoCandidaturaOptions}
          fullWidth
          disabled={isLicenciatura}
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
