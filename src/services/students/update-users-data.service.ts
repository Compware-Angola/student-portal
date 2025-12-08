import { authApi } from '@/lib/auth-api'

export type UpdateUserParams = {
  name?: string
  telefone?: string
  email?: string
}

/**
 * Atualiza os dados de um usuário pelo userId
 */
export async function updateUser(
  userId: string,
  params: UpdateUserParams
): Promise<{ message: string }> {
  return authApi
    .put(`studets/users/${userId}`, { json: params })
    .json<{ message: string }>()
}
