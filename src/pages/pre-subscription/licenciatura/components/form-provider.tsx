'use client'

import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { steps } from './step'
import { preSubscriptionSchema, type PreSubscriptionSchema } from '../schemas'
import { useMutationPreInscricao } from '@/hooks/pre-registation/use-mutation-pre-registration'
import { useUploadSingle } from '@/hooks/upload/use-upload-single'
import { toast } from 'sonner'
import { useUpdateStudentPhoto } from '@/hooks/student/use-mutation-update-student-photo'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { DocumentTypeEnum } from '@/enums/document.type.enum'

type ContextValue = {
  onSubmit: (data: PreSubscriptionSchema) => void
  form: UseFormReturn<PreSubscriptionSchema>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  handleNextOrSubmit: () => Promise<void>
  handleBack: () => void
  steps: typeof steps
  progress: number
  isLoadingPreInscription: boolean
}

export const FormPreSubscriptionContext =
  React.createContext<null | ContextValue>(null)

export function FormPreSubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const progress = ((currentStep + 1) / steps.length) * 100
  const { createPreInscricaoAsync, createPreInscricaoPending } =
    useMutationPreInscricao()

  const uploadMutation = useUploadSingle()
  const isLoadingPreInscription =
    createPreInscricaoPending || uploadMutation.isPending
  const currentStepConfig = steps[currentStep]

  const updateStudentPhoto = useUpdateStudentPhoto({
    skipInvalidate: true,
  })

  const { profileData } = useQueryProfile()

  const uploadFile = async (data: File) => {
    const formData = new FormData()
    formData.append('file', data)
    const response = await uploadMutation.mutateAsync(data)
    return response.file.filename
  }

  function buildInscricaoPayload(data: any, docs: any) {
    return {
      cursoCandidatura: Number(data.intendedCourse),
      modalidadeFrequencia: 2,
      codigoTurno: parseInt(data.period),
      codigoTurnoOptional: parseInt(data.periodSecondOption),
      nomeCompleto: data.fullName,
      bilheteIdentidade: data.documentNumber,
      dataEmissaoBI: data.issueDate,
      dataValidadeBI: data.expirationDate,
      sexo: data.gender,
      dataNascimento: data.birthDate,
      estadoCivil: data.maritalStatus,
      contactosTelefonicos: data.phone,
      contactoDeEmergencia: data.phoneAlt || '',
      moradaCompleta: data.street,
      email: data.email,
      instituicaoFormacao: data.previousSchool,
      cursoFormacao: data.previousCourse,
      dataConclusao: data.graduationYear,
      mediaFinal: Number(data.averageGrade),
      pai: data.fatherName,
      mae: data.motherName,
      necessidadeEspecialId: data.needs === 'sim' ? 1 : 0,
      poloId: Number(data.pole),
      cursoOpcional1Id: Number(data.intendedCourseSecond),
      cursoOpcional2Id: Number(data.intendedCourseThird),
      documentos: docs,
      codigoNacionalidade: Number(data.codigoNacionalidade),
      codigoTipoCandidatura: Number(data.typeGraduation),
      inquerito:
        data.howDidYouKnow === 'outros'
          ? data.howDidYouKnowOther
          : data.howDidYouKnow,
    }
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
      previousCourse: '',
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
      typeGraduation: '',
      codigoNacionalidade: '',
      howDidYouKnow: '',
    },
    mode: 'onChange',
  })

  const onSubmit = React.useCallback(async (data: PreSubscriptionSchema) => {
    let photoPath: string | undefined = undefined
    let documentPath: string | undefined = undefined
    let certificatePath: string | undefined = undefined
    const docs = []
    if (data.photo) {
      photoPath = await uploadFile(data.photo)
      updateStudentPhoto.mutateAsync(
        { file: photoPath, userId: profileData?.userId! },
        {},
      )
    }
    if (data.document) {
      documentPath = await uploadFile(data.document)
      docs.push({
        typeDocumentId: parseInt(data.documentType),
        fileName: documentPath,
      })
    }
    if (data.certificate) {
      certificatePath = await uploadFile(data.certificate)
      docs.push({
        typeDocumentId: DocumentTypeEnum.CERTIFICADO_COM_NOTAS,
        fileName: certificatePath,
      })
    }
    const payload = buildInscricaoPayload(data, docs)
    await createPreInscricaoAsync(payload)
  }, [])

  const handleNextOrSubmit = React.useCallback(async () => {
    const valid = await form.trigger(currentStepConfig.fields, {
      shouldFocus: true,
    })

    if (!valid) return

    if (currentStepConfig.submitOnStep) {
      try {
        await form.handleSubmit(async (data) => {
          await onSubmit(data)
          setCurrentStep((prev) => prev + 1)
        })()
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao fazer a pre inscrição.')
      }
      return
    }

    if (!currentStepConfig.isSummary) {
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
    isLoadingPreInscription,
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
      'useFormPreSubscriptionForm deve ser usado dentro de FormPreSubscriptionProvider',
    )
  }

  return context
}
