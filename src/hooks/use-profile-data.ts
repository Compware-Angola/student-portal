import { getProfile } from '@/services/profile.service'
import type { StudentProfile } from '@/types/profile'
import { extractFirstAndLastName } from '@/utils/extract-first-and-last-name'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const CURRICULUM_YEAR_MAP: Record<string, string> = {
  '1': 'Primeiro ano',
  '2': 'Segundo ano',
  '3': 'Terceiro ano',
  '4': 'Quarto ano',
  '5': 'Quinto ano',
}

function getCurriculumYear(year: string): string {
  return CURRICULUM_YEAR_MAP[year] || 'Unknown'
}

function formatDateOfBirth(timestamp: number | undefined): string {
  if (!timestamp) return 'N/A'

  try {
    return new Date(timestamp * 1000).toLocaleDateString('pt-AO')
  } catch {
    return 'N/A'
  }
}

export function useProfileData() {
  const { data, isLoading, error, isError } = useQuery<StudentProfile>({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
    retry: 0,
  })

  const profileData = useMemo(() => {
    if (!data) {
      return null
    }
    const enrollment = data.enrollment
    const timetoReconfirm = data.timetoReconfirm
    const refId = data.student.refId
    const courseId =
      data.applicationRecord?.academicApplication?.courseAppliedId
    const fullName =
      data.applicationRecord?.personalInfo?.fullName || data.student.username
    const { firstName, lastName } = extractFirstAndLastName(fullName)
    const curriculumYearRaw = data.student?.curriculumYear || 'N/A'
    const dateOfBirthTimestamp =
      data.applicationRecord?.personalInfo?.dateOfBirth

    return {
      enrollment,
      timetoReconfirm,
      courseId,
      refId,
      firstName,
      lastName,
      fullName,
      gender: data?.applicationRecord?.personalInfo?.gender || 'N/A',
      curriculumYear: getCurriculumYear(curriculumYearRaw),
      email: data.student?.email ?? 'N/A',
      phone: data.applicationRecord?.contact?.phoneNumbers?.[0] || 'N/A',
      address: data.applicationRecord?.contact?.address || 'N/A',
      dateOfBirth:
        typeof dateOfBirthTimestamp === 'number'
          ? formatDateOfBirth(dateOfBirthTimestamp)
          : 'unknown',
    }
  }, [data])

  return {
    profileData,
    isLoading,
    error,
    isError,
  }
}
