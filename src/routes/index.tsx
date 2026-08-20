import { Routes, Route } from 'react-router-dom'
import { AuthRoutes } from './auth'
import { MainRoutes } from './main'
import { FallbackRoute } from './fallback'

export function AppRoutes() {
  return (
    <Routes>
      {AuthRoutes()}
      {MainRoutes()}
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  )
}
