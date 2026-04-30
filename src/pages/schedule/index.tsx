import { useState, useMemo, useEffect } from 'react'
import { useQueryStudentSchedule } from '@/hooks/schedule/use-query-student-schedule'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { useYearSelect } from '@/components/year-select/use-year-select'
import { organizarPorDia } from './utils'
import { ScheduleHeader } from './components/schedule-header'
import { ScheduleBody } from './components/schedule-body'

export function Schedule() {
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)

  const {
    error: errorProfile,
    isError: isErrorProfile,
    isLoading: isLoadingProfile,
    profileData,
  } = useQueryProfile()

  const preEnrollmentCode = profileData?.preEnrollmentCode
  const enrollmentCode = profileData?.enrollmentCode

  const { academicYears, defaultYear } = useYearSelect(enrollmentCode)

  const {
    data: scheduleData,
    isError: isErrorSchedule,
    isLoading: isLoadingSchedule,
  } = useQueryStudentSchedule({ academicYear: selectedYear, preEnrollmentCode })

  useEffect(() => {
    if (defaultYear) setSelectedYear(defaultYear)
  }, [defaultYear])

  const schedule = useMemo(() => organizarPorDia(scheduleData), [scheduleData])

  return (
    <div className="space-y-6">
      <ScheduleHeader
        academicYears={academicYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        schedule={schedule}
      />
      <ScheduleBody
        isLoading={isLoadingProfile || isLoadingSchedule || !defaultYear}
        isError={isErrorProfile || isErrorSchedule}
        errorMessage={errorProfile?.message}
        schedule={schedule}
      />
    </div>
  )
}