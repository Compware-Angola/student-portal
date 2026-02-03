import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AuthStorage } from '@/storage/auth-storage'
import { useNavigate } from 'react-router-dom'
import { confirmOldEnrollmentService, type EnrollmentGrade } from '@/services/enrolment/confirm-enrollment-old-student.service'

type ConfirmOldStudentEnrollmentProps =  {
  selectedGrades: EnrollmentGrade[],
  semestre: number
}
export function useMutationConfirmOldStudentEnrollment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async ({selectedGrades,semestre}: ConfirmOldStudentEnrollmentProps) => {
      const pre = AuthStorage.get()?.codigoPreinscricao
      if (!pre) throw new Error('Código de pré-inscrição não encontrado.')
      return await confirmOldEnrollmentService({
        codPreInscricao: pre,
        grades: selectedGrades,
        semestre: semestre!
      })
    },

    onSuccess: async () => {
      toast.success('Matrícula confirmada, aguarda confirmação de pagamento')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({
        queryKey: ['academic-confirmation-new-student'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['student-situation'],
      })
      await queryClient.invalidateQueries({ queryKey: ['finance-monthly-fee'] })
      navigate('/financas')
    },

    onError: (error: Error) => {
      toast.error(
        error?.message ||
          'Erro ao confirmar matrícula de aluno antigo. Tente novamente.',
      )
    },
  })

  return {
    confirmOldStudentEnrollment: mutate,
    confirmOldStudentEnrollmentAsync: mutateAsync,
    confirmOldStudentEnrollmentPending: isPending,
    confirmOldStudentEnrollmentSuccess: isSuccess,
  }
}
