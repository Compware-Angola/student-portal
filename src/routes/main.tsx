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
import { Assessments } from '@/pages/assessments'
import { AcademicServices } from '@/pages/services'
import { AcademicCalendar } from '@/pages/dashboard/academic-calendar'
import { ExamCalendar } from '@/pages/dashboard/exam-calendar'

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
      <Route path="/calendario-academico" element={<AcademicCalendar />} />
      <Route path="/calendario-exames" element={<ExamCalendar />} />
      <Route path="/matricula" element={<Enrollment />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/horario" element={<Schedule />} />
      <Route path="/pagamento-antecipado" element={<AdvancePayment />} />
      <Route path="/avaliacoes" element={<Assessments />} />
      <Route path="/servicos-academicos" element={<AcademicServices />} />
      <Route path="/financas" element={<Finance />} />
      <Route path="/renegociacao" element={<Renegociation />} />
      <Route path="/pre-inscricao" element={<PreSubscription />} />
    </Route>
  )
}
