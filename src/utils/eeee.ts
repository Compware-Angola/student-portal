import type { AcademicTest } from '@/types/schedule'
import {
  differenceInMonths,
  isFuture,
  isPast,
  isToday,
  parseISO,
} from 'date-fns'

export function filterExamsWithinOneMonth(examCalendar: AcademicTest[]) {
  return examCalendar.filter((exam) => {
    try {
      const examDate = parseISO(exam.data_prova)
      const diff = differenceInMonths(new Date(), examDate)

      return (
        isFuture(examDate) ||
        isToday(examDate) ||
        (isPast(examDate) && diff <= 1)
      )
    } catch {
      return false
    }
  })
}
