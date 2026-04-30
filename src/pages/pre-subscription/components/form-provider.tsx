'use client'

import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { steps } from './step'
import { preSubscriptionSchema, type PreSubscriptionSchema } from '../schemas'
import { useMutationPreInscricao } from '@/hooks/pre-registation/use-mutation-pre-registration'

type ContextValue = {
  onSubmit: (data: PreSubscriptionSchema) => void
  form: UseFormReturn<PreSubscriptionSchema>
  //  isLoading: boolean
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  handleNextOrSubmit: () => Promise<void>
  handleBack: () => void
  steps: typeof steps
  progress: number
}

export const FormPreSubscriptionContext =
  React.createContext<null | ContextValue>(null)

export function FormPreSubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentStep, setCurrentStep] = React.useState(3)
  const progress = (currentStep / steps.length) * 100
  const {createPreInscricaoAsync,createPreInscricaoPending,createPreInscricaoSuccess} = useMutationPreInscricao()

  function buildInscricaoPayload(data: any) {
  return {
    cursoCandidatura: Number(data.intendedCourse),
    modalidadeFrequencia: Number(data.period),
    nomeCompleto: data.fullName,
    bilheteIdentidade: data.documentNumber,
    dataEmissaoBI: data.issueDate,
    dataValidadeBI: data.expirationDate,
    sexo: data.gender,
    dataNascimento: data.birthDate,
    estadoCivil: data.maritalStatus,
    contactosTelefonicos: data.phone,
    contactoDeEmergencia: data.phoneAlt || "",
    moradaCompleta: data.street,
    email: data.email,
    instituicaoFormacaoAcesso: isNaN(Number(data.previousSchool))
      ? undefined
      : Number(data.previousSchool),
    dataConclusao: data.graduationYear,
    mediaFinal: Number(data.averageGrade),
    pai: data.fatherName,
    mae: data.motherName,
    necessidadeEspecialId: data.needs === "sim" ? 1 : 0,
    poloId: Number(data.pole),
    cursoOpcional1Id: Number(data.intendedCourseSecond),
    cursoOpcional2Id: Number(data.intendedCourseThird),
  };
}

  const form = useForm<PreSubscriptionSchema>({
    resolver: zodResolver(preSubscriptionSchema),
    defaultValues: {
      birthDate: '',
      documentNumber: '',
      fullName: '',
      documentType: '',
      expirationDate: '',
      fatherName: '',
      gender: '',
      issueDate: '',
      maritalStatus: '',
      motherName: '',
      needs: '',
      averageGrade: '0',
      graduationYear: '',
      previousSchool: '',
      intendedCourse: '',
      intendedCourseSecond: '',
      intendedCourseThird: '',
      period: '',
      periodSecondOption: '',
      pole: '',
      email: '',
      phone: '',
      phoneAlt: '',
      street: '',
    },
    mode: 'onChange',
  })

  const onSubmit = React.useCallback(async (data: PreSubscriptionSchema) => {
    console.log(data)
    const payload = buildInscricaoPayload(data);
    await createPreInscricaoAsync(payload);
  }, [])

  const handleNextOrSubmit = React.useCallback(async () => {
    const isLastStep = currentStep === steps.length - 1
    const valid = await form.trigger(steps[currentStep].fields, {
      shouldFocus: true,
    })

    if (!valid) return
    if (isLastStep) {
      form.handleSubmit(onSubmit)()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, form, onSubmit])

  const handleBack = React.useCallback(() => {
    setCurrentStep((prev) => prev - 1)
  }, [])

  const value: ContextValue = {
    form,
    onSubmit,
    currentStep,
    setCurrentStep,
    handleNextOrSubmit,
    handleBack,
    steps,
    progress,
  }

  return (
    <FormPreSubscriptionContext.Provider value={value}>
      {children}
    </FormPreSubscriptionContext.Provider>
  )
}

export function useFormPreSubscriptionForm() {
  const context = React.useContext(FormPreSubscriptionContext)

  if (!context) {
    throw new Error(
      'useFormPreSubscriptionForm deve ser usado dentro de ApplyFormProvider',
    )
  }

  return context
}
