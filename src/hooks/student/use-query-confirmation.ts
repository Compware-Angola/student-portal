import { useQuery } from "@tanstack/react-query"
import { getConfirmation,type ConfirmationParams } from "@/services/students/confirmation.service"

export function useQueryConfirmation(
    params: ConfirmationParams) {
    return useQuery({
        queryKey: ['confirmation-student', params],
        queryFn: () => getConfirmation(params),
        enabled: !!params.studentId && !!params.academicYearCode && !!params.semesterCode,
    })
}