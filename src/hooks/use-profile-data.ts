import { getProfile, type ProfileResponse } from '@/services/profile.service'
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
  const { data, isLoading, error } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  })

  const profileData = useMemo(() => {
    if (!data) {
      return {
        firstName: '',
        lastName: '',
        fullName: 'N/A',
        gender: 'N/A',
        curriculumYear: 'N/A',
        email: 'N/A',
        phone: '',
        address: '',
        dateOfBirth: 'N/A',
      }
    }

    const fullName = data.applicationRecord?.personalInfo?.fullName || 'N/A'
    const { firstName, lastName } = extractFirstAndLastName(fullName)
    const curriculumYearRaw = data.student?.curriculumYear || 'N/A'
    const dateOfBirthTimestamp =
      data.applicationRecord?.personalInfo?.dateOfBirth

    return {
      firstName,
      lastName,
      fullName,
      gender: data.applicationRecord?.personalInfo?.gender || 'N/A',
      curriculumYear: getCurriculumYear(curriculumYearRaw),
      email: data.student.email ?? 'N/A',
      phone: data.applicationRecord?.contact?.phoneNumbers?.[0] || 'N/A',
      address: data.applicationRecord?.contact?.address || 'N/A',
      dateOfBirth: formatDateOfBirth(dateOfBirthTimestamp),
    }
  }, [data])

  return {
    profileData,
    isLoading,
    error,
  }
}
