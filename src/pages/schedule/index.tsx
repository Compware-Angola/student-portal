import { useState, useMemo } from 'react'
import { useQueryStudentSchedule } from '@/hooks/schedule/use-query-student-schedule'
import { useQueryProfile } from '@/hooks/profile/use-query-profile'
import { ScheduleHeader } from './components/schedule-header'
import { ScheduleBody } from './components/schedule-body'
import { useScheduleYears } from './use-schedule-years'
import { obterDiaAtual, organizarPorDia } from './utils'

export function Schedule() {
  const [diaSelecionado, setDiaSelecionado] = useState(obterDiaAtual())
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined,
  )

  const {
    error: errorProfile,
    isError: isErrorProfile,
    isLoading: isLoadingProfile,
    profileData,
  } = useQueryProfile()

  const preEnrollmentCode = profileData?.preEnrollmentCode
  const enrollmentCode = profileData?.enrollmentCode

  const { academicYears, defaultYear } = useScheduleYears(enrollmentCode)

  const {
    data: scheduleData,
    isError: isErrorSchedule,
    isLoading: isLoadingSchedule,
  } = useQueryStudentSchedule({
    academicYear: selectedYear,
    preEnrollmentCode,
  })

  const schedule = useMemo(() => organizarPorDia(scheduleData), [scheduleData])
  return (
    <div className="space-y-6 p-6">
      <ScheduleHeader
        academicYears={academicYears}
        selectedYear={selectedYear ?? defaultYear}
        onYearChange={setSelectedYear}
      />

      <ScheduleBody
        isLoading={isLoadingProfile || isLoadingSchedule}
        isError={isErrorProfile || isErrorSchedule}
        errorMessage={errorProfile?.message}
        schedule={schedule}
        diaSelecionado={diaSelecionado}
        onDiaChange={setDiaSelecionado}
      />
    </div>
  )
}
