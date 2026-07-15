import { useEffect } from 'react'
import { InputFormField } from '@/components/input-form-field'
import { SelectFormField } from '@/components/selectFormField'
import { useFormPreSubscriptionForm } from './form-provider'
import { howDidYouKnowOptions } from '../schemas/survey-data.schema'

export function SurveyData() {
  const { form } = useFormPreSubscriptionForm()
  const howDidYouKnow = form.watch('howDidYouKnow')
  const isOutros = howDidYouKnow === 'outros'

  // Limpa o campo livre quando o usuário troca pra uma opção diferente de "Outros"
  useEffect(() => {
    if (!isOutros) {
      form.setValue('howDidYouKnowOther', '', {
        shouldValidate: false,
        shouldDirty: false,
      })
    }
  }, [isOutros, form])

  return (
    <>
      <SelectFormField
        control={form.control}
        name="howDidYouKnow"
        label="Como você chegou até a Universidade Metodista?"
        placeholder="Selecione"
        items={[...howDidYouKnowOptions]}
        fullWidth
      />

      {isOutros && (
        <InputFormField
          control={form.control}
          name="howDidYouKnowOther"
          label="Conte-nos como"
          placeholder="Descreva como conheceu a Universidade"
          type="text"
        />
      )}
    </>
  )
}
