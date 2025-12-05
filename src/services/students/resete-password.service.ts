import { authApi } from '@/lib/auth-api'
export type UpdatePasswordParams = {

  newPassword: string
  confirmPassword: string
}

export async function updateStudentPassword(
  userId: string,
  params: UpdatePasswordParams
): Promise<{ message: string }> {
  return authApi
    .put(`studets/${userId}/reset-password`, { json: params })
    .json<{ message: string }>()
}
