import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { PreSubscriptionLicenciatura } from './licenciatura'
import { PreSubscriptionPostgraduate } from './postgraduate'
import { TipoCandidaturaPath, useTipoCandidaturaPath } from './tipo-candidatura'

export function PreSubscription() {
  const { profileData } = useQueryProfile()
  const tipo = useTipoCandidaturaPath()

  if (!profileData) return null

  const isLicenciatura =
    tipo !== null
      ? tipo === TipoCandidaturaPath.LICENCIATURA
      : profileData.grau_academico === 'Licenciatura' ||
        profileData.codigo_tipo_candidatura === 1

  if (isLicenciatura) {
    return <PreSubscriptionLicenciatura />
  }
  return <PreSubscriptionPostgraduate />
}
