import type { IEnrollment } from "@/pages/enrollment/types/enrollment";

export const getAllAvaliableEnrollments = (enrollments: IEnrollment[]) => {
  return enrollments.filter(enrollment => enrollment.enrollmentStatus == 'ACTIVE_REGULAR' );
}
export const getAllHIstoricEnrollments = (enrollments: IEnrollment[]) => {
  return enrollments.filter(enrollment => enrollment.enrollmentStatus != 'ACTIVE_REGULAR' );
}