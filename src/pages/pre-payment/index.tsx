import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreInvoice } from './components/pre-invoice'
import { useQueryCurrentAcademicYear } from '@/hooks/academic-year/use-query-current-academic-year'

export const PrePayment = () => {
  const { profileData } = useQueryProfile()
  const {
    data: currentAcademicYear,
  } = useQueryCurrentAcademicYear()
  return (
    <PreInvoice
      enrollmentCode={String(profileData?.codigo_preinscricao)}
      selectedYear={String(currentAcademicYear?.codigo ?? '')}
    />
  )
}