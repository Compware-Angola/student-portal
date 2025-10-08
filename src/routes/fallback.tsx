import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export function FallbackRoute() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true }) // 🔐 Vai para o dashboard
    } else {
      navigate('/auth/login', { replace: true }) // 🔑 Vai para login
    }
  }, [isAuthenticated, navigate])

  return null
}
