import Layout from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Route } from 'react-router-dom'
import { RequireAuth } from './require-auth'

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
    </Route>
  )
}
