import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { Grade } from '@/types/grade'
import { useNavigate } from 'react-router-dom'
import { enrollmentService, type EnrollmentDiscipline } from '@/services/enrolment/confirm-enrollment-new-student.service'

type ConfirmNewStudentEnrollmentParams = {
  selectedSubjects: Grade[]
  codPreInscricao: string
  anoLectivo: number
}

export function useMutationConfirmNewStudentEnrollment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isSuccess, mutateAsync, isPending } = useMutation({
    mutationFn: async ({ selectedSubjects, codPreInscricao, anoLectivo }: ConfirmNewStudentEnrollmentParams) => {
      if (!codPreInscricao) throw new Error('Código de pré-inscrição não encontrado.')

      const grades = selectedSubjects.map<EnrollmentDiscipline>((s) => ({
       codigo: parseInt(s.codigoGrade),
       duracaoDisciplina: s.duracaoDisciplina,
       semestre: s.semestreId
      }))
      return await enrollmentService({
        codPreInscricao,
        anoLectivo,
        grades
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