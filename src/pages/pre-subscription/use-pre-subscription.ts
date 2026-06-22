// import { CheckCheck, FileText, GraduationCap, User } from 'lucide-react'
// import React from 'react'
// import { toast } from 'sonner'

// export const usePreSubscriptionLicenciatura = () => {
//   const [currentStep, setCurrentStep] = React.useState(3)
//   const [isSubmitting, setIsSubmitting] = React.useState(false)
//   const totalSteps = 4
//   const progress = (currentStep / totalSteps) * 100
//   const steps = [
//     { number: 1, title: 'Dados Pessoais', icon: User },
//     { number: 2, title: 'Dados Académicos', icon: GraduationCap },
//     { number: 3, title: 'Dados da Candidatura', icon: FileText },
//     { number: 4, title: 'Revisão', icon: CheckCheck },
//   ]
//   const onSubmitPersonal = () => {
//     setCurrentStep(2)
//   }
//   const onSubmitAcademic = () => {
//     setCurrentStep(3)
//   }
//   const onSubmitDocuments = () => {
//     setCurrentStep(4)
//   }
//   const onFinalSubmit = async () => {
//     setIsSubmitting(true)
//     await new Promise((resolve) => setTimeout(resolve, 2000))
//     toast.success('Pré-inscrição realizada com sucesso!', {
//       description: 'Receberá um email com os próximos passos.',
//     })
//     setIsSubmitting(false)
//   }
//   const goBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   return {
//     currentStep,
//     isSubmitting,
//     progress,
//     steps,
//     onSubmitPersonal,
//     onSubmitAcademic,
//     onSubmitDocuments,
//     onFinalSubmit,
//     goBack,
//   }
// }
