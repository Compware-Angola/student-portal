import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreInvoice } from './components/pre-invoice'

export const PrePayment = () => {
  const { profileData } = useQueryProfile()

  return (
    <PreInvoice
      enrollmentCode={String(profileData?.codigo_preinscricao)}
      selectedYear="23"
    />
  )
}
