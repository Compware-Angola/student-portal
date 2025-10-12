import { api } from '@/lib/key'

export type Student = {
  id: string
  refId: string
  username: string
  email: string | null
  active: boolean
  curriculumYear: string
}

export type ApplicationRecord = {
  id: string
  refId: number
  academicApplication:AcademicApplication
  personalInfo: {
    fullName: string
    dateOfBirth: number
    gender: string
  }
  contact: {
    address: string
    phoneNumbers: string[]
  }
  financial: {
    balance: number
    previousBalance: number
  }
}
export type AcademicApplication = {
  courseAppliedId: string
}

export type ProfileResponse = {
  student: Student
  applicationRecord: ApplicationRecord
  timetoReconfirm: boolean
}

export async function getProfile(): Promise<ProfileResponse> {
  return await api.get('v1/auth/profile').json<ProfileResponse>()
}
