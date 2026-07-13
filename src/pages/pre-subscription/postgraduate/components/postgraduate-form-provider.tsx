'use client'
console.log('Provider loaded')
import { useForm, type UseFormReturn } from 'react-hook-form'
import {
  preSubscriptionPostGraduateSchema,
  type PreSubscriptionPostGraduateSchema,
} from '../schemas'
import { steps } from './step'
import React from 'react'
import { useUploadSingle } from '@/hooks/upload/use-upload-single'
import { useMutationPreInscricao } from '@/hooks/pre-registation/use-mutation-pre-registration'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useUpdateStudentPhoto } from '@/hooks/student/use-mutation-update-student-photo'
import { DocumentTypeEnum } from '@/enums/document.type.enum'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

type PostGraduateContextValue = {
  onSubmit: (data: PreSubscriptionPostGraduateSchema) => void
  form: UseFormReturn<PreSubscriptionPostGraduateSchema>
  currentStep: number
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
  handleNextOrSubmit: () => Promise<void>
  handleBack: () => void
  steps: typeof steps
  progress: number
  isLoadingPreInscription: boolean
}

export const FormPreSubscriptionContextPostGraduate =
  React.createContext<null | PostGraduateContextValue>(null)

export function FormPreSubscriptionPostGraduateProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const progress = (currentStep + 1 / steps.length) * 100
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
    console.log({ data: data.typeGraduation })
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
      codigoTipoCandidatura: Number(data.intendedGraduation),
      inquerito: data.howDidYouKnow,
    }
  }

  const form = useForm<PreSubscriptionPostGraduateSchema>({
    resolver: zodResolver(preSubscriptionPostGraduateSchema),
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
      intendedCourse: '',
      intendedCourseSecond: '',
      intendedCourseThird: '',
      period: '',
      periodSecondOption: '',
      email: '',
      phone: '',
      phoneAlt: '',
      street: '',
      codigoNacionalidade: '',
      howDidYouKnow: '',
    },
    mode: 'onChange',
  })

  const onSubmit = React.useCallback(
    async (data: PreSubscriptionPostGraduateSchema) => {
      const docs = []
      if (data.photo) {
        const photoPath = await uploadFile(data.photo)
        updateStudentPhoto.mutateAsync(
          { file: photoPath, userId: profileData?.userId! },
          {},
        )
      }
      if (data.document) {
        const documentPath = await uploadFile(data.document)
        docs.push({
          typeDocumentId: parseInt(data.documentType),
          fileName: documentPath,
        })
      }
      // if (data.certificate) {
      //  const certificatePath = await uploadFile(data.certificate)
      //   docs.push({
      //     typeDocumentId: DocumentTypeEnum.CERTIFICADO_COM_NOTAS,
      //     fileName: certificatePath,
      //   })
      // }
      if (data.curriculumVitae) {
        const cvPath = await uploadFile(data.curriculumVitae)
        docs.push({
          typeDocumentId: DocumentTypeEnum.CURRICULUM_VITAE,
          fileName: cvPath,
        })
      }
      if (data.scientificInvestigationProject) {
        const projectPath = await uploadFile(
          data.scientificInvestigationProject,
        )
        docs.push({
          typeDocumentId: DocumentTypeEnum.PROJECTO_DE_INVESTIGACAO_CIENTIFICA,
          fileName: projectPath,
        })
      }
      const payload = buildInscricaoPayload(data, docs)
      await createPreInscricaoAsync(payload)
    },
    [],
  )

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

  const value: PostGraduateContextValue = {
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
    <FormPreSubscriptionContextPostGraduate.Provider value={value}>
      {children}
    </FormPreSubscriptionContextPostGraduate.Provider>
  )
}
