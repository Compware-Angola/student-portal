import Layout from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Route } from 'react-router-dom'
import { RequireAuth } from './require-auth'
import { Enrollment } from '@/pages/enrollment'
import { ConfirmEnrollment } from '@/pages/enrollment/confirm-enrollment'

export function MainRoutes() {
  return (
    <Route
      path="/"
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path='/matricula' element={<Enrollment />} />
      <Route path='/confirmar-matricula' element={<ConfirmEnrollment />} />
    </Route>
  )
}
