import { useQuery } from "@tanstack/react-query";
import { fetchCandidateExam, type ExamResponse } from "@/services/exame-acesso/exame.service";

export function useQueryCandidateExam(candidateId: number, enabled: boolean = true) {
    return useQuery<ExamResponse>({
        queryKey: ["candidate-exam", candidateId],
        queryFn: () => fetchCandidateExam(candidateId),
        enabled: !!candidateId && enabled,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}