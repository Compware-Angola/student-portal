import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { confirmEnrolmentOldStudent } from '@/services/enrolment/confirm-enrolment-old-student.service'
import type { OldStudentGrade } from '@/services/enrolment/confirm-enrolment-old-student.service'
import { AuthStorage } from '@/storage/auth-storage'

export function useMutationConfirmOldStudentEnrollment() {
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (selectedGrades: OldStudentGrade[]) => {
      const pre = AuthStorage.get()?.codigoPreinscricao
      if (!pre) throw new Error('Código de pré-inscrição não encontrado.')
      return await confirmEnrolmentOldStudent({
        enrollmentCode: pre,
        grades: selectedGrades,
      })
    },

    onSuccess: async () => {
      toast.success('Matrícula de aluno antigo confirmada com sucesso!')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
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
