import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthRoutes } from './auth'
import { MainRoutes } from './main'
import { FallbackRoute } from './fallback'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {AuthRoutes()}
        {MainRoutes()}

        <Route path="*" element={<FallbackRoute />} />
      </Routes>
    </BrowserRouter>
  )
}
