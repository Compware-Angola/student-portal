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
import { Comunicado } from '@/pages/login/Comunicado'


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
      <Route index element={<Dashboard />} />
      
        
      <Route
        path="/calendario-academico"
        element={
          <RequireStudentWithEnrolmentCode>
            <AcademicCalendar />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/calendario-exames"
        element={
          <RequireStudentWithEnrolmentCode>
            <ExamCalendar />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path={enrollmentPath.slice(1)}
        element={enrollmentComponents[enrollmentPath]}
      />
      <Route
        path="/horario"
        element={
          <RequireStudentWithEnrolmentCode>
            <Schedule />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/pagamento-antecipado"
        element={
          <RequireStudentWithEnrolmentCode>
            <AdvancePayment />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/avaliacoes"
        element={
          <RequireStudentWithEnrolmentCode>
            <Assessments />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/servicos-academicos"
        element={
          <RequireStudentWithEnrolmentCode>
            <AcademicServices />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/financas"
        element={
          <RequireStudentWithEnrolmentCode>
            <Finance />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/renegociacao"
        element={
          <RequireStudentWithEnrolmentCode>
            <Renegociation />
          </RequireStudentWithEnrolmentCode>
        }
      />

      <Route
        path="/mensagens"
        element={
          <RequireStudentWithEnrolmentCode>
            <MensagensNotificacoes />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/suporte"
        element={
          <RequireStudentWithEnrolmentCode>
            <Suporte />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route
        path="/disciplinas"
        element={
          <RequireStudentWithEnrolmentCode>
            <DisciplinasMatriculadas />
          </RequireStudentWithEnrolmentCode>
        }
      />
      <Route path="/financas/notas-pagamento" element={<NotaPagamento />} />

      <Route path="/pre-inscricao" element={<PreSubscription />} />
      <Route path="/perfil" element={<Profile />} />
    </Route>



    <Route   path="/comunicado"
      element={
        <RequireAuth>
         <Comunicado />
        </RequireAuth>
      } />
 </Route>
  )
}

export function RequireStudentWithEnrolmentCode({
  children,
}: {
  children: JSX.Element
}) {
  const { hasEnrolmentCode, isLoading } = useStudentSituation()

  if (isLoading) return null

  if (!hasEnrolmentCode) {
    return <Navigate to="/" replace />
  }

  return children
}
