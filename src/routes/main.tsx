import Layout from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Route } from 'react-router-dom'
import { RequireAuth } from './require-auth'
import { Enrollment } from '@/pages/enrollment'
import { Profile } from '@/pages/profile'
import { AdvancePayment } from '@/pages/advance-payment/inde'
import { Finance } from '@/pages/finance'
import { Renegociation } from '@/pages/renegotiation'
import { PreSubscription } from '@/pages/pre-subscription'

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
      <Route path="/matricula" element={<Enrollment />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/pagamento-antecipado" element={<AdvancePayment />} />
      <Route path="/financa" element={<Finance />} />
      <Route path="/renegociacao" element={<Renegociation />} />
      <Route path="/presubscription" element={<PreSubscription />} />
    </Route>
  )
}
