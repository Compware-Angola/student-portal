import type { StudentProfile } from '@/services/profile'

export type ProfileData = {
  firstName: string
  lastName: string
  fullName: string
  birthDate: string
  admissionDate: string
  enrollmentDate: string
  gender: string
  enrollmentState: string
  course: string
  polo: string
  email: string
  foto?: string
  numero_documento: string | null
  telefone: string | null
  address: string
  curso: string
  enrollmentCode: string
  preEnrollmentCode: string
  curso_duracao?: number
  estado_matricula?: string
  userId?: string
} & StudentProfile
