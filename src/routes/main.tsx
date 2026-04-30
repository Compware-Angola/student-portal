import Layout from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Navigate, Route, useLocation } from 'react-router-dom'
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
import { MensagensNotificacoes } from '@/pages/MensagensNotificacoes'
import { Suporte } from '@/pages/Suporte'
import { DisciplinasMatriculadas } from '@/pages/DisciplinasMatriculadas'
import { NotaPagamento } from '@/pages/NotaPagamento'
import { useStudentSituation } from '@/hooks/use-student-stitiation'
import { getEnrollmentRoute } from '@/utils/map-student-situation'
import { RegistrationsUC } from '@/pages/registrationsUC'
import { useMemo, type JSX } from 'react'
import { Comunicado } from '@/pages/login/Comunicado'
import NotificacoesPage from '@/pages/notification/notificacoes-page'

import { getHomeRoute, routePermissions } from './permission'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import PreIncriptionDashboard from '@/pages/dashboard/pre-inscription-dashboard'

export function MainRoutes() {
  const { isLoading, hasEnrolmentCode } = useStudentSituation()
  const enrollmentComponents: Record<string, JSX.Element> = useMemo(
    () => ({
      '/inscricao-uc': <RegistrationsUC />,
      '/matricula': <Enrollment />,
    }),
    [],
  )
  if (isLoading) return null

  const enrollmentPath = getEnrollmentRoute(hasEnrolmentCode)

  return (
    <Route>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <RequireStudentRoute>
              <Dashboard />
            </RequireStudentRoute>
          }
        />

        <Route
          path="/calendario-academico"
          element={
            <RequireStudentRoute>
              <AcademicCalendar />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/calendario-exames"
          element={
            <RequireStudentRoute>
              <ExamCalendar />
            </RequireStudentRoute>
          }
        />
        <Route
          path={enrollmentPath.slice(1)}
          element={enrollmentComponents[enrollmentPath]}
        />
        <Route
          path="/horario"
          element={
            <RequireStudentRoute>
              <Schedule />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/pagamento-antecipado"
          element={
            <RequireStudentRoute>
              <AdvancePayment />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/avaliacoes"
          element={
            <RequireStudentRoute>
              <Assessments />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/servicos-academicos"
          element={
            <RequireStudentRoute>
              <AcademicServices />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/financas"
          element={
            <RequireStudentRoute>
              <Finance />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/renegociacao"
          element={
            <RequireStudentRoute>
              <Renegociation />
            </RequireStudentRoute>
          }
        />

        <Route
          path="/mensagens"
          element={
            <RequireStudentRoute>
              <MensagensNotificacoes />
            </RequireStudentRoute>
          }
        />
        <Route path="/notificacoes" element={<NotificacoesPage />} />
        <Route
          path="/suporte"
          element={
            <RequireStudentRoute>
              <Suporte />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/disciplinas"
          element={
            <RequireStudentRoute>
              <DisciplinasMatriculadas />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/pre-dashboard"
          element={
            <RequireStudentRoute>
              <PreIncriptionDashboard />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/financas/notas-pagamento"
          element={
            <RequireStudentRoute>
              <NotaPagamento />
            </RequireStudentRoute>
          }
        />

        <Route
          path="/pre-inscricao"
          element={
            <RequireStudentRoute>
              <PreSubscription />
            </RequireStudentRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireStudentRoute>
              <Profile />
            </RequireStudentRoute>
          }
        />
      </Route>

      <Route
        path="/comunicado"
        element={
          <RequireAuth>
            <Comunicado />
          </RequireAuth>
        }
      />
    </Route>
  )
}

export function RequireStudentRoute({ children }: { children: JSX.Element }) {
  const { isLoading, studentStatus } = useQueryProfile()

  const location = useLocation()

  if (isLoading || !studentStatus) return null

  const allowedRoutes = routePermissions[studentStatus]
  console.log(location.pathname)
  const homeRoute = getHomeRoute(studentStatus)
  console.log(homeRoute)
  if (!allowedRoutes.includes(location.pathname)) {
    return <Navigate to={homeRoute} replace />
  }

  return children
}
