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
  tipo_documento: string | null
  grau_academico: 'Mestrado' | 'Doutoramento' | 'Licenciatura'
  telefone: string | null
  address: string
  curso: string
  enrollmentCode: string
  preEnrollmentCode: string
  curso_duracao?: number
  estado_matricula?: string
  userId?: string
} & StudentProfile
