import {
  updateStudentPhoto,
  type UpdateStudentPhoto,
} from '@/services/students/update-photo.service'
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'

export function useUpdateStudentPhoto(): UseMutationResult<
  { message: string },
  Error,
  UpdateStudentPhoto
> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStudentPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
