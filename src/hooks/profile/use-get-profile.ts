import { getProfile, type StudentProfile } from '@/services/profile'
import { extractFirstAndLastName } from '@/utils/extract-first-and-last-name'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const CURRICULUM_YEAR_MAP: Record<string, string> = {
  '1': 'Primeiro ano',
  '2': 'Segundo ano',
  '3': 'Terceiro ano',
  '4': 'Quarto ano',
  '5': 'Quinto ano',
}

export function getCurriculumYear(year: string): string {
  return CURRICULUM_YEAR_MAP[year] || 'Unknown'
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A'

  try {
    const parsedDate = new Date(dateString)
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })
  } catch {
    return 'N/A'
  }
}

export function useGetProfile() {
  const { data, isLoading, error, isError } = useQuery<StudentProfile>({
    queryKey: ['profile2'],
    queryFn: () => getProfile('19'),
    staleTime: Infinity,
    retry: 0,
  })

  const profileData = useMemo(() => {
    if (!data) {
      return null
    }

    const { firstName, lastName } = extractFirstAndLastName(data.nome_completo)

    return {
      firstName,
      lastName,
      fullName: data.nome_completo,
      birthDate: data.data_nascimento,
      admissionDate: data.data_admissao,
      enrollmentDate: data.data_matricula,
      gender: data.sexo,
      enrollmentState: data.estado_matricula,
      course: data.curso,
      polo: data.polo,
      email: data.email,
      phone: '',
      address: '',
      curso: data.curso,
    }
  }, [data])

  return {
    profileData,
    isLoading,
    error,
    isError,
  }
}
