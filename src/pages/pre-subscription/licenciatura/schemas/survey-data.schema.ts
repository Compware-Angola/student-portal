import { z } from 'zod'

export const howDidYouKnowOptions = [
  { label: 'Metodista vai até você', value: 'metodista_vai_ate_voce' },
  { label: 'Feira das Profissões da Metodista', value: 'feira_das_profissoes' },
  { label: 'Spot na rádio', value: 'spot_radio' },
  { label: 'Redes sociais da Universidade', value: 'redes_sociais' },
  { label: 'Outros', value: 'outros' },
] as const

const howDidYouKnowValues = howDidYouKnowOptions.map((o) => o.value) as [
  string,
  ...string[],
]

export const surveyDataSchema = z.object({
  howDidYouKnow: z.enum(howDidYouKnowValues, {
    error: 'Selecione como conheceu a Universidade',
  }),
  howDidYouKnowOther: z
    .string()
    .max(600, { message: 'Este campo deve ter no máximo 600 caracteres' })
    .optional(),
})

// regra condicional exportada à parte, pra aplicar via .superRefine no schema final
export function refineHowDidYouKnowOther(
  data: { howDidYouKnow?: string; howDidYouKnowOther?: string },
  ctx: z.RefinementCtx,
) {
  if (data.howDidYouKnow === 'outros' && !data.howDidYouKnowOther?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Descreva como conheceu a Universidade',
      path: ['howDidYouKnowOther'],
    })
  }
}

export const SurveyDataKeys = ['howDidYouKnow', 'howDidYouKnowOther'] as const
