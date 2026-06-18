import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreSubscriptionLicenciatura } from './licenciatura'
import { PreSubscriptionPostgraduate } from './postgraduate'

export function PreSubscription() {
  const { profileData } = useQueryProfile()
  if(!profileData) return null
  if (

    profileData.grau_academico === 'Licenciatura'
  ) {
    return (
      <PreSubscriptionLicenciatura/>
    )
  }
  return <PreSubscriptionPostgraduate/>
}
