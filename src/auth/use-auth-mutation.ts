import { useMutation } from '@tanstack/react-query'
import { login, type AuthCredentials, type AuthResponse } from '@/services/auth/login.service'
import { AuthStorage } from '@/storage/auth-storage'

export function useAuthMutation() {
    return useMutation({
        mutationFn: async (data: AuthCredentials) => await login(data),
        mutationKey: ["auth-login"],
        onError: (error: Error) => {
            throw new Error(error.message)
        },
        onSuccess: (response: AuthResponse) => {
            if (response.user.password_reset_required == 0) {
                AuthStorage.save({
                    codigoPreinscricao: response.user.codigopreinscricao,
                    token: response.access_token,
                    user_id: response.user.id,
                    user_name: response.user.nomecompleto,
                })
            }
        }
    })
}