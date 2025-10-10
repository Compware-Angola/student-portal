export interface Discipline {
  id: string
  name: string
}

export interface IEnrollment {
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
