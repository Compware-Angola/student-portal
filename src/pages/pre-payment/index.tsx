import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreInvoice } from './components/pre-invoice'
import { useQueryAcademicYear } from '@/hooks/academic-year/use-query-academic-year'

export const PrePayment = () => {
  const { profileData } = useQueryProfile()
  const { data: academicYears } = useQueryAcademicYear()

  const activeYear = academicYears?.anolectivos?.find(
    (year) => year.estado === 'Activo'
  )

  return (
    <PreInvoice
      enrollmentCode={String(profileData?.codigo_preinscricao)}
      selectedYear={String(activeYear?.codigo ?? '')}
    />
  )
}