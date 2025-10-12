import { api } from "@/lib/key"

export type Subject = {
  id: string
  name: string
  registrationDate: string
  unitTypeId: string
  unitNatureId: string
  code: string
  abbreviation: string
  duration: number
  previousName: string
  previousDuration: number
  courseId: string
}

export type SubjectResponse = {
  totalPages: number
  totalElements: number
  pageable: {
    paged: boolean
    pageNumber: number
    pageSize: number
    offset: number
    sort: Array<{
      direction: string
      nullHandling: string
      ascending: boolean
      property: string
      ignoreCase: boolean
    }>
    unpaged: boolean
  }
  size: number
  content: Subject[]
  number: number
  sort: Array<{
    direction: string
    nullHandling: string
    ascending: boolean
    property: string
    ignoreCase: boolean
  }>
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export async function getSubject(): Promise<SubjectResponse> {
  return await api.get('v1/subjects').json<SubjectResponse>()
}
