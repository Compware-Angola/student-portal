import { apexApi } from '@/lib/apex-api'
export type UpdateStudentPhoto = {
  file: string
  userId: string
}

export async function updateStudentPhoto(
  params: UpdateStudentPhoto,
): Promise<{ message: string }> {
  return apexApi
    .put(`students/photo`, { json: params })
    .json<{ message: string }>()
}
