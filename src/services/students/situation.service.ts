import { apexApi } from '@/lib/apex-api'

export type StudentSituationResponse = {
  codigo_status: string | number
  codigo_matricula: string
}

type StudentSituationParams = {
  preErrolmentCode: string
}

export async function getStudentSituation(
  params: StudentSituationParams,
): Promise<StudentSituationResponse> {
  const endpoint = `students/situation/${params.preErrolmentCode}`
  return apexApi.get(endpoint).json<StudentSituationResponse>()
}
