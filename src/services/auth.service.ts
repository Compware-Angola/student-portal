import { api } from '@/lib/key'

type AuthResponse = {
  token: string
}

type AuthCredentials = {
  username: string
  password: string
}
export interface EnrollmentDiscipline {
  id: string
  name: string
}

export interface EnrollmentItem {
  id: string
  enrollmentCode: string
  studentAdmissionId: string
  courseId: string
  studentNumber: string
  academicYear: string
  semester: string
  enrollmentStatus: string
  enrollmentDate: string
  updatedAt: string
  courseName: string
  disciplines: EnrollmentDiscipline[]
}

export interface EnrollmentResponse {
  content: EnrollmentItem[]
  number: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export function authenticate(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  return api.post('v1/auth/login', { json: credentials }).json<AuthResponse>()
}

export function logout(): Promise<void> {
  return api.post('v1/auth/logout').json<void>()
}

// export function getProfile(): Promise<Profile> {
//   return api.get('v1/auth/profile').json<Profile>()
// }

export async function getEnrollments(studentId: string): Promise<EnrollmentResponse> {
  const response = await api.get(`v1/enrrolments?search=${studentId}`).json<EnrollmentResponse>()
  return response
}