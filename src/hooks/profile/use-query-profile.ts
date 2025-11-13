import { getProfile, type StudentProfile } from '@/services/profile'
import { extractFirstAndLastName } from '@/utils/extract-first-and-last-name'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { AuthStorage } from '@/storage/auth-storage'
import type { ProfileData } from '@/types/profile'

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

export function useQueryProfile() {
  const auth = AuthStorage.get()
  const { data, isLoading, error, isError, refetch } = useQuery<StudentProfile>(
    {
      queryKey: ['profile'],
      //eslint-disable-next-line
      queryFn: () => getProfile(auth?.codigoPreinscricao!),
      staleTime: Infinity,
      retry: 0,
      enabled: !!auth,
    },
  )

  const profileData: ProfileData | null = useMemo(() => {
    if (!data) {
      return null
    }

    const { firstName, lastName } = extractFirstAndLastName(data.nome_completo)

    return {
      ...data,
      firstName,
      lastName,
      fullName: data.nome_completo,
      birthDate: data.data_nascimento,
      admissionDate: data.data_admissao,
      enrollmentDate: data.data_matricula,
      gender: data.sexo,
      enrollmentState: data.estado_matricula,
      course: data.curso ?? data.curso_candidatura_designacao,
      polo: data.polo,
      email: data.email,
      phone: '',
      address: '',
      curso: data.curso ?? data.curso_candidatura_designacao,
      codigo_curso: data.codigo_curso ?? data.curso_candidatura,
      enrollmentCode: data.codigo_matricula,
      preEnrollmentCode: data.codigo_preinscricao,
    }
  }, [data])

  return {
    profileData,
    isLoading,
    error,
    isError,
    refetch,
  }
}
