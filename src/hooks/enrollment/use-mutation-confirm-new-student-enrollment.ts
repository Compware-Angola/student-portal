import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AuthStorage } from '@/storage/auth-storage'

import { confirmEnrolmentNewStudent } from '@/services/enrolment/confirm-enrolment-new-student.service'
import type { Grade } from '@/types/grade'
import { useNavigate } from 'react-router-dom'

export function useMutationConfirmNewStudentEnrollment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isSuccess, mutateAsync, isPending } = useMutation({
    mutationFn: async (selectedSubjects: Grade[]) => {
      const pre = AuthStorage.get()?.codigoPreinscricao
      if (!pre) throw new Error('Código de pré-inscrição não encontrado.')

      const grades = selectedSubjects.map((s) => s.codigoGrade)
      return await confirmEnrolmentNewStudent({ studentId: pre, grades })
    },

    onSuccess: async () => {
      toast.success('Matrícula confirmada')
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
          'Ocorreu um erro ao confirmar a matrícula. Tente novamente.',
      )
    },
  })

  return {
    confirmNewStudentEnrollment: mutate,
    confirmNewStudentEnrollmentAsync: mutateAsync,
    confirmNewStudentEnrollmentSuccess: isSuccess,
    confirmNewStudentEnrollmentPending: isPending,
  }
}
