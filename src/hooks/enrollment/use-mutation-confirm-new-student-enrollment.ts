import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { AuthStorage } from '@/storage/auth-storage'
import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'
import { confirmEnrolmentNewStudent } from '@/services/enrolment/confirm-enrolment-new-student.service'

export function useMutationConfirmNewStudentEnrollment() {
  const queryClient = useQueryClient()

  const { mutate, isSuccess, mutateAsync, isPending } = useMutation({
    mutationFn: async (selectedSubjects: NewStudentCurriculumSubject[]) => {
      const pre = AuthStorage.get()?.codigoPreinscricao
      if (!pre) throw new Error('Código de pré-inscrição não encontrado.')

      const grades = selectedSubjects.map((s) => s.codigoGrade)
      return await confirmEnrolmentNewStudent({ studentId: pre, grades })
    },

    onSuccess: async () => {
      toast.success('Matrícula confirmada')
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    // eslint-disable-next-line
    onError: (error: any) => {
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
