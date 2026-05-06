import {
  updateStudentPhoto,
  type UpdateStudentPhoto,
} from '@/services/students/update-photo.service'
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'

type UseUpdateStudentPhotoOptions = {
  skipInvalidate?: boolean
}

export function useUpdateStudentPhoto(
  options?: UseUpdateStudentPhotoOptions,
): UseMutationResult<{ message: string }, Error, UpdateStudentPhoto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStudentPhoto,
    onSuccess: () => {
      if(!options?.skipInvalidate)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
