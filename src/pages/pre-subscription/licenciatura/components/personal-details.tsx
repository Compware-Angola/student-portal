import { useFormPreSubscriptionForm } from './form-provider'
import { InputFormField } from '@/components/input-form-field'
import { SelectFormField } from '@/components/selectFormField'
import { useQueryEstadoCivil } from '@/hooks/dropdowns/use-query-estado-civil'
import { useQueryNacionalidade } from '@/hooks/dropdowns/use-query-nacionalidade'
import { useQueryNecessidadesEspeciais } from '@/hooks/dropdowns/use-query-necessidade-especial'
import { useQuerySex } from '@/hooks/dropdowns/use-query-sex'
import { useQueryTipoDocumento } from '@/hooks/dropdowns/use-query-tipo-documento'
import { RegisterAvatarSelector } from '@/pages/login/components/register-avatar-selector'

export function PersonalDetails() {
  const { form } = useFormPreSubscriptionForm()
  const { data: tipoDocumentos } = useQueryTipoDocumento()
  const { data: tipoSexos } = useQuerySex()
  const { data: tipoNacionalidades } = useQueryNacionalidade()
  const { data: estadoCivil } = useQueryEstadoCivil()
  const { data: necessidadeEspeciais } = useQueryNecessidadesEspeciais()
  const documentoOptions =
    tipoDocumentos?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

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
        />
        <InputFormField
          control={form.control}
          name="documentNumber"
          label="Número do Documento"
          placeholder="Digite o número"
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
