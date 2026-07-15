import { useQueryProfile } from '@/hooks/profile/use-query-profile'

import { useQueryTipoDocumento } from '@/hooks/dropdowns/use-query-tipo-documento'
import { useQuerySex } from '@/hooks/dropdowns/use-query-sex'
import { useQueryNacionalidade } from '@/hooks/dropdowns/use-query-nacionalidade'
import { useQueryEstadoCivil } from '@/hooks/dropdowns/use-query-estado-civil'
import { useQueryNecessidadesEspeciais } from '@/hooks/dropdowns/use-query-necessidade-especial'
import { useEffect } from 'react'
import { RegisterAvatarSelector } from '@/pages/login/components/register-avatar-selector'
import { InputFormField } from '@/components/input-form-field'
import { SelectFormField } from '@/components/selectFormField'
import { useFormPreSubscriptionPostGraduateForm } from './hook'

export function PersonalDetailsPostGraduate() {
  const { profileData } = useQueryProfile()
  const { form } = useFormPreSubscriptionPostGraduateForm()
  const { data: tipoDocumentos } = useQueryTipoDocumento()
  const { data: tipoSexos } = useQuerySex()
  const { data: tipoNacionalidades } = useQueryNacionalidade()
  const { data: estadoCivil } = useQueryEstadoCivil()
  const { data: necessidadeEspeciais } = useQueryNecessidadesEspeciais()

  console.table(profileData)
  const documentoOptions =
    tipoDocumentos?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []
  useEffect(() => {
    if (!profileData) return
    form.setValue('fullName', profileData.fullName)
    form.setValue('documentNumber', String(profileData.numero_documento))
    form.setValue('documentType', String(profileData.tipo_documento))
  }, [profileData, form])
  const tipoSexoOptions =
    tipoSexos?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []
  const tipoNacionalidaddesOptions =
    tipoNacionalidades?.map((t) => ({
      label: t.label,
      value: String(t.value),
    })) ?? []
  const estadoCivilOptions =
    estadoCivil?.map((t) => ({
      label: t.designacao,
      value: String(t.designacao),
    })) ?? []
  const necessidadeEspeciasOptions =
    necessidadeEspeciais?.map((t) => ({
      label: t.label,
      value: String(t.value),
    })) ?? []
  return (
    <>
      <RegisterAvatarSelector
        onImageSelect={(file) => {
          form.setValue('photo', file, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }}
      />
      {/* Nome completo */}
      <InputFormField
        control={form.control}
        name="fullName"
        label="Nome Completo"
        disabled
        placeholder="Digite o nome completo"
      />

      {/* Data de nascimento e género */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          control={form.control}
          name="birthDate"
          label="Data de Nascimento"
          placeholder="Digite a data de nascimento"
          type="date"
        />
        <SelectFormField
          control={form.control}
          name="gender"
          label="Género"
          placeholder="Selecione"
          items={tipoSexoOptions}
          fullWidth
        />
      </div>

      {/* Nome da mãe e do pai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          control={form.control}
          name="motherName"
          label="Nome da Mãe"
          placeholder="Digite o nome da mãe"
        />
        <InputFormField
          control={form.control}
          name="fatherName"
          label="Nome do Pai"
          placeholder="Digite o nome do pai"
        />
      </div>

      {/* Estado civil e necessidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFormField
          control={form.control}
          name="maritalStatus"
          label="Estado Civil"
          placeholder="Selecione"
          items={estadoCivilOptions}
          fullWidth
        />
        <SelectFormField
          control={form.control}
          name="needs"
          label="Necessidades"
          placeholder="Selecione"
          items={necessidadeEspeciasOptions}
          fullWidth
        />
      </div>

      {/* Tipo e número de documento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFormField
          control={form.control}
          name="documentType"
          label="Tipo de Documento"
          placeholder="Selecione"
          items={documentoOptions}
          fullWidth
          disabled
        />
        <InputFormField
          control={form.control}
          name="documentNumber"
          label="Número do Documento"
          placeholder="Digite o número"
          disabled
        />
      </div>

      {/* Datas de emissão e validade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputFormField
          control={form.control}
          name="issueDate"
          label="Data de Emissão"
          type="date"
        />
        <InputFormField
          control={form.control}
          name="expirationDate"
          label="Data de Validade"
          type="date"
        />
      </div>
      <SelectFormField
        control={form.control}
        name="codigoNacionalidade"
        label="Nacionalidade"
        placeholder="Selecione Nacionalidade"
        items={tipoNacionalidaddesOptions}
        fullWidth
      />
    </>
  )
}
