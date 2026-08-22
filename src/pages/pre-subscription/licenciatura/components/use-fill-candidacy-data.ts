'use client'

import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useQueryPreInscricaoFicha } from '@/hooks/pre-registation/use-query-pre-registration'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import type { PreInscricaoFichaResponse } from '@/services/pre-inscrition/type'
import type { PreSubscriptionSchema } from '../schemas'

type FillForm = UseFormReturn<PreSubscriptionSchema>

const GENDER_MAP: Record<string, string> = {
  Masculino: '2',
  Feminino: '1',
}

function toDate(value?: string | null): string {
  if (!value) return ''
  return value.split('T')[0]
}

// Só preenche quando o campo ainda está vazio, para nunca sobrescrever
// o que o candidato já tenha digitado/alterado.
function setIfEmpty(
  form: FillForm,
  name: keyof PreSubscriptionSchema,
  value: string | number | undefined | null,
) {
  if (value === undefined || value === null || value === '') return
  if (form.getValues(name)) return
  form.setValue(name, String(value), {
    shouldValidate: false,
    shouldDirty: false,
  })
}

function fillDadosPessoais(form: FillForm, ficha: PreInscricaoFichaResponse) {
  const d = ficha.dados_pessoais
  if (!d) return

  setIfEmpty(form, 'fullName', d.nome_completo)
  setIfEmpty(form, 'birthDate', toDate(d.data_nascimento))
  setIfEmpty(form, 'gender', GENDER_MAP[d.sexo])
  setIfEmpty(form, 'maritalStatus', d.estado_civil)
  setIfEmpty(form, 'codigoNacionalidade', d.codigo_nacionalidade)
  setIfEmpty(form, 'phone', d.contactos_telefonicos)
  setIfEmpty(form, 'phoneAlt', d.contacto_de_emergencia)
  setIfEmpty(form, 'street', d.morada_completa)
  setIfEmpty(form, 'email', d.email)
  setIfEmpty(form, 'needs', d.necessidade_especial_id)
}

function fillDocumento(form: FillForm, ficha: PreInscricaoFichaResponse) {
  const doc = ficha.documento
  if (!doc) return

  setIfEmpty(form, 'documentType', doc.tipo_identificacao)
  setIfEmpty(
    form,
    'documentNumber',
    doc.numero_documento ?? doc.bilhete_identidade,
  )
  setIfEmpty(form, 'issueDate', toDate(doc.data_emissao_bi))
  setIfEmpty(form, 'expirationDate', toDate(doc.data_validade_bi))
}

function fillFormacaoAnterior(
  form: FillForm,
  ficha: PreInscricaoFichaResponse,
) {
  const f = ficha.formacao_anterior
  if (!f) return

  setIfEmpty(form, 'previousSchool', f.instituicao_formacao)
  setIfEmpty(form, 'previousCourse', f.curso_ensino_medio)
  setIfEmpty(form, 'graduationYear', toDate(f.data_conclusao))
  setIfEmpty(form, 'averageGrade', f.media_final)
}

function fillFamilia(form: FillForm, ficha: PreInscricaoFichaResponse) {
  const familia = ficha.familia
  if (!familia) return

  setIfEmpty(form, 'fatherName', familia.pai)
  setIfEmpty(form, 'motherName', familia.mae)
}

function fillCandidatura(form: FillForm, ficha: PreInscricaoFichaResponse) {
  const c = ficha.candidatura
  if (!c) return

  setIfEmpty(form, 'typeGraduation', c.codigo_tipo_candidatura)
  setIfEmpty(form, 'pole', c.polo_id)
}

function fillOpcoesCurso(form: FillForm, ficha: PreInscricaoFichaResponse) {
  const opcoes = [...(ficha.opcoes_curso ?? [])].sort(
    (a, b) => a.opcao - b.opcao,
  )

  setIfEmpty(form, 'intendedCourse', opcoes[0]?.codigo)
  setIfEmpty(form, 'period', opcoes[0]?.turno_codigo)
  setIfEmpty(form, 'intendedCourseSecond', opcoes[1]?.codigo)
  setIfEmpty(form, 'periodSecondOption', opcoes[1]?.turno_codigo)
  setIfEmpty(form, 'intendedCourseThird', opcoes[2]?.codigo)
}

/**
 * Preenche automaticamente o formulário de candidatura (licenciatura)
 * a partir da ficha de pré-inscrição existente do candidato,
 * caso os dados existam e os campos ainda estejam vazios.
 */
export function useFillCandidacyData(
  form: UseFormReturn<PreSubscriptionSchema>,
) {
  const { profileData } = useQueryProfile()
  const { data: ficha } = useQueryPreInscricaoFicha(profileData?.user_id ?? '')

  useEffect(() => {
    if (!ficha) return

    fillDadosPessoais(form, ficha)
    fillDocumento(form, ficha)
    fillFormacaoAnterior(form, ficha)
    fillFamilia(form, ficha)
    fillCandidatura(form, ficha)
    fillOpcoesCurso(form, ficha)
  }, [ficha, form])
}
