import { useFormPreSubscriptionForm } from './form-provider'
import { InputFormField } from '@/components/input-form-field'
import { SelectFormField } from '@/components/selectFormField'

export function PersonalDetails() {
  const { form } = useFormPreSubscriptionForm()

  return (
    <>
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
          items={[
            { value: 'masculino', label: 'Masculino' },
            { value: 'feminino', label: 'Feminino' },
            { value: 'outro', label: 'Outro' },
          ]}
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
          items={[
            { value: 'solteiro', label: 'Solteiro' },
            { value: 'casado', label: 'Casado' },
            { value: 'divorciado', label: 'Divorciado' },
            { value: 'viúvo', label: 'Viúvo' },
          ]}
          fullWidth
        />

        <SelectFormField
          control={form.control}
          name="needs"
          label="Necessidades"
          placeholder="Selecione"
          items={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
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
          items={[
            { value: 'bi', label: 'Bilhete de Identidade' },
            { value: 'passaporte', label: 'Passaporte' },
            { value: 'dire', label: 'DIRE' },
          ]}
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
    </>
  )
}
