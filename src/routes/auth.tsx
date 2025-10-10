import { useAuth } from '@/hooks/use-auth'
import { Login } from '@/pages/login'
import { Route, Navigate } from 'react-router-dom'

export function AuthRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Route path="/auth">
      <Route index element={<Navigate to="/auth/login" replace />} />

      <Route
        path="login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
    </Route>
  )
}
