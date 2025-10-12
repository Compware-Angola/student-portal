import { api } from '@/lib/key'

export type EnrollmentFilters = {
  studentAdmissionId?: string
  courseId?: string
  academicYear?: string
  semester?: string
  enrollmentDateFrom?: string
  enrollmentDateTo?: string
  search?: string
  enrollmentStatus?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
}

export type Enrollment = {
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
  disciplines: Discipline[]
}

export type Discipline = {
  id: string
  name: string
}

type EnrollmentPaginated = {
  content: []
  number: 0
  size: 10
  totalElements: 0
  totalPages: 0
  last: boolean
}

export async function getEnrollmentsWithFilters(filters?: EnrollmentFilters) {
  return await api
    .get<EnrollmentPaginated>('v1/enrollments', {
      searchParams: filters,
    })
    .json<EnrollmentPaginated>()
}

export async function addEnrollment(data: any) {
  return await api.post('v1/enrollments',{json:data}).json<any>()
}