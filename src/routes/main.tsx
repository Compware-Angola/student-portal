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
import { Schedule } from '@/pages/schedule'
import { Evaluation } from '@/pages/evaluation'
import { AcademicServices } from '@/pages/services'

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
      <Route path="/horario" element={<Schedule />} />
      <Route path="/pagamento-antecipado" element={<AdvancePayment />} />
      <Route path="/avaliacoes" element={<Evaluation />} />
      <Route path="/servicos-academicos" element={<AcademicServices />} />
      <Route path="/financas" element={<Finance />} />
      <Route path="/renegociacao" element={<Renegociation />} />
      <Route path="/pre-inscricao" element={<PreSubscription />} />
    </Route>
  )
}
