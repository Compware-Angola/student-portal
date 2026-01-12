import Layout from '@/components/layout'
import { Dashboard } from '@/pages/dashboard'
import { Navigate, Route } from 'react-router-dom'
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

export function MainRoutes() {
  const { studentType, isLoading } = useStudentSituation()
  const enrollmentComponents: Record<string, JSX.Element> = useMemo(
    () => ({
      '/inscricao-uc': <RegistrationsUC />,
      '/matricula': <Enrollment />,
    }),
    [],
  )
  if (isLoading) return null
  if (!studentType) return null

  const enrollmentPath = getEnrollmentRoute(studentType)

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

      <Route
        path="/calendario-academico"
        element={
          <RequireOldStudent>
            <AcademicCalendar />
          </RequireOldStudent>
        }
      />
      <Route
        path="/calendario-exames"
        element={
          <RequireOldStudent>
            <ExamCalendar />
          </RequireOldStudent>
        }
      />
      <Route
        path={enrollmentPath.slice(1)}
        element={enrollmentComponents[enrollmentPath]}
      />
      <Route
        path="/horario"
        element={
          <RequireOldStudent>
            <Schedule />
          </RequireOldStudent>
        }
      />
      <Route
        path="/pagamento-antecipado"
        element={
          <RequireOldStudent>
            <AdvancePayment />
          </RequireOldStudent>
        }
      />
      <Route
        path="/avaliacoes"
        element={
          <RequireOldStudent>
            <Assessments />
          </RequireOldStudent>
        }
      />
      <Route
        path="/servicos-academicos"
        element={
          <RequireOldStudent>
            <AcademicServices />
          </RequireOldStudent>
        }
      />
      <Route
        path="/financas"
        element={
          <RequireOldStudent>
            <Finance />
          </RequireOldStudent>
        }
      />
      <Route
        path="/renegociacao"
        element={
          <RequireOldStudent>
            <Renegociation />
          </RequireOldStudent>
        }
      />

      <Route
        path="/mensagens"
        element={
          <RequireOldStudent>
            <MensagensNotificacoes />
          </RequireOldStudent>
        }
      />
      <Route
        path="/suporte"
        element={
          <RequireOldStudent>
            <Suporte />
          </RequireOldStudent>
        }
      />
      <Route
        path="/disciplinas"
        element={
          <RequireOldStudent>
            <DisciplinasMatriculadas />
          </RequireOldStudent>
        }
      />
      <Route path="/financas/notas-pagamento" element={<NotaPagamento />} />

      <Route path="/pre-inscricao" element={<PreSubscription />} />
      <Route path="/perfil" element={<Profile />} />
    </Route>
  )
}

type RequireOldStudentProps = {
  children: JSX.Element
}

export function RequireOldStudent({ children }: RequireOldStudentProps) {
  const { studentType, isLoading } = useStudentSituation()

  if (isLoading) return null

  if (studentType !== 'OLD') {
    return <Navigate to="/" replace />
  }

  return children
}
