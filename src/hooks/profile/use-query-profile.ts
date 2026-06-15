import { getProfile, type CurrentUserResponse } from '@/services/profile'
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
  const { data, isLoading, error, isError, refetch } =
    useQuery<CurrentUserResponse>({
      queryKey: ['profile'],
      queryFn: getProfile,
      staleTime: Infinity,
      retry: 0,
      enabled: !!auth,
    })

  const profileData: ProfileData | null = useMemo(() => {
    const authData = data?.user
    if (!authData) {
      return null
    }

    const { firstName, lastName } = extractFirstAndLastName(
      authData.nome_completo,
    )

    return {
      ...authData,
      firstName,
      lastName,
      fullName: authData?.nome_completo,
      birthDate: authData?.data_nascimento,
      admissionDate: authData?.data_admissao,
      enrollmentDate: authData?.data_matricula ?? '-',
      gender: authData?.sexo,
      enrollmentState: authData?.estado_matricula,
      course: authData?.curso ?? authData?.curso_candidatura_designacao,
      polo: authData?.polo,
      email: authData?.email,
      phone: authData?.telefone,
      address: '',
      curso: authData?.curso ?? authData?.curso_candidatura_designacao,
      codigo_curso: authData.codigo_curso ?? authData.curso_candidatura,
      enrollmentCode: authData?.codigo_matricula?.toString() ?? null,
      preEnrollmentCode: authData?.codigo_preinscricao?.toString() ?? null,
      estado_matricula: authData?.estado_matricula,
      numero_documento: authData?.numero_documento,
      userId: authData?.user_id.toString(),
      estado_aluno: authData?.estado_aluno,
    }
  }, [data])

  return {
    profileData,
    isLoading,
    studentStatus: profileData?.estado_aluno,
    error,
    isError,
    refetch,
  }
}
