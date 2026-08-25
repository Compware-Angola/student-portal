import { useSearchParams } from 'react-router-dom'

export const TipoCandidaturaPath = {
  LICENCIATURA: 'licenciatura',
  MESTRADO: 'mestrado',
  DOUTORAMENTO: 'doutoramento',
} as const

export type TipoCandidaturaPathType =
  (typeof TipoCandidaturaPath)[keyof typeof TipoCandidaturaPath]

export function useTipoCandidaturaPath(): TipoCandidaturaPathType | null {
  const [searchParams] = useSearchParams()
  const raw = searchParams.get('tipo')

  if (raw === TipoCandidaturaPath.MESTRADO) return TipoCandidaturaPath.MESTRADO
  if (raw === TipoCandidaturaPath.DOUTORAMENTO)
    return TipoCandidaturaPath.DOUTORAMENTO
  if (raw === TipoCandidaturaPath.LICENCIATURA)
    return TipoCandidaturaPath.LICENCIATURA

  return null
}

export function buildPreInscricaoPath(tipo: TipoCandidaturaPathType): string {
  return `/pre-inscricao?tipo=${tipo}`
}
