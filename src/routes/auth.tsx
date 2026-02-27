import { useAuth } from '@/hooks/use-auth'
import { Login } from '@/pages/login'
import RenovarSenha from '@/pages/login/components/renew-password'
import { Register } from '@/pages/register'
import { Route, Navigate } from 'react-router-dom'

export function AuthRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Route path="/auth">
      <Route index element={<Navigate to="/auth/login" replace />} />
      <Route
        path="renovar-senha/:token"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RenovarSenha />
        }
      />

      <Route
        path="login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="registro"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
    </Route>
  )
}
