type Student = {
  id: string
  refId: string
  username: string
  password: string
  email: string | null
  emailVerifiedAt: string | null
  rememberToken: string
  channel: number
  status: string
  blockReason: string | null
  academicYear: string | null
  curriculumYear: string | null
  createdAt: number
  updatedAt: number
  active: boolean
}

type Enrollment = {
  id: string
  enrollmentCode: string
  enrollmentDate: [number, number, number] | null
  studentNumber: string
  enrollmentStatus: string
  updatedAt: [number, number, number] | null
  studentAdmissionId: string
  courseId: string
  courseName: string
  academicYear: string
  semester: string
}

type PersonalInfo = {
  fullName: string | null
  gender: string | null
  dateOfBirth: number | null
  maritalStatus: string | null
  nationalityId: string | null
  birthProvinceId: string | null
  placeOfBirth: string | null
}

type Identification = {
  idCardNumber: string | null
  idIssueDate: number | null
  idExpiryDate: number | null
  taxNumber: string | null
}

type Contact = {
  address: string | null
  phoneNumbers: string[] | null
  email: string | null
  emergencyContact: {
    name: string | null
    phone: string | null
  } | null
}

type AcademicApplication = {
  academicYearId: string | null
  enrollmentNature: string | null
  admissionMethod: string | null
  applicationTypeId: string | null
  courseAppliedId: string | null
  optionalCourses: string[] | null
  modeOfAttendance: string | null
  shiftId: string | null
  campusId: string | null
}

type PreviousEducation = {
  institution: string | null
  completionDate: number | null
  finalGrade: string | null
  secondaryCourse: string | null
  qualificationLevel: string | null
}

type ProfessionalInfo = {
  workplace: string | null
  workStartDate: string | null
  workProvince: string | null
  medicalOrderNumber: string | null
}

type FamilyBackground = {
  father: {
    name: string | null
    occupation: string | null
    profession: string | null
    academicDegree: string | null
  } | null
  mother: {
    name: string | null
    occupation: string | null
    profession: string | null
    academicDegree: string | null
  } | null
  spouse: {
    name: string | null
    occupation: string | null
    profession: string | null
    academicDegree: string | null
  } | null
}

type SpecialConditions = {
  specialNeeds: string | null
  permanentRelocation: boolean | null
}

type Financial = {
  balance: number | null
  previousBalance: number | null
  discount: number | null
  discountNote: string | null
  paymentCourseCode: string | null
  allowEnrollment: boolean | null
  fineExemption: boolean | null
}

type ApplicationRecord = {
  id: string
  refId: string | null
  studentId: string
  personalInfo: PersonalInfo | null
  identification: Identification | null
  contact: Contact | null
  academicApplication: AcademicApplication | null
  previousEducation: PreviousEducation | null
  professionalInfo: ProfessionalInfo | null
  familyBackground: FamilyBackground | null
  specialConditions: SpecialConditions | null
  financial: Financial | null
}

export type StudentProfile = {
  student: Student
  enrollment: Enrollment | null
  applicationRecord: ApplicationRecord | null
  timetoReconfirm: boolean
}
