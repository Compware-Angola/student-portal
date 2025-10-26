'use client'

import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { steps } from './step'
import { preSubscriptionSchema, type PreSubscriptionSchema } from '../schemas'

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
  const [currentStep, setCurrentStep] = React.useState(0)
  const progress = (currentStep / steps.length) * 100

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
      averageGrade: 0,
      graduationYear: '',
      previousSchool: '',
      intendedCourse: '',
      pole: '',
      secondOption: '',
    },
    mode: 'onChange',
  })

  const onSubmit = React.useCallback(async (data: PreSubscriptionSchema) => {
    console.log(data)
    // const result = await createJobApplicationAsync({
    //   fullName: data.fullName,
    //   identityNumber: data.identityNumber,
    //   birthDate: data.birthDate,
    //   genderId: data.genderId,
    //   maritalStatusId: data.maritalStatusId,
    //   email: data.email,
    //   phoneNumber: data.phoneNumber,
    //   optionalPhoneNumber: data.optionalPhoneNumber,
    //   desiredPositionId: data.desiredPositionId,
    //   availabilityDate: data.availabilityDate,
    //   ProfessionalExperience: data.ProfessionalExperience || [],
    //   highestDegreeId: data.highestDegreeId,
    //   courses: data.courses,
    //   languages: data.languages,
    //   skills: data.skills,
    //   hasChildren: data.hasChildren === 'YES',
    //   location: {
    //     cityId: data.cityId,
    //     districtId: data.districtId,
    //     street: data.street,
    //   },
    //   knownDiseases: data.knownDiseases === 'YES',
    //   experienceLevelId: data.experienceLevelId,
    // })
    // if (result?.success) {
    //   setCurrentStep(0)
    //   form.reset()
    // }
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
