import { submitCandidateExam, submitCandidateExamFinal, type SubmitExamRequest, type SubmitExamResponse } from "@/services/exame-acesso/exame.submeter.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useSubmitCandidateExam(candidateId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitExamResponse, Error, SubmitExamRequest>({
        mutationFn: (payload) => submitCandidateExam(candidateId, payload),

        onSuccess: () => {
            // atualiza ou invalida o exame do candidato
            queryClient.invalidateQueries({
                queryKey: ["candidate-exam", candidateId],
            });

            
        },

        onError: (error) => {
            console.error("Erro ao submeter exame:", error.message);
        },
    });
}



export function useSubmitCandidateExamFinal(candidateId: number) {
    const queryClient = useQueryClient();

    return useMutation<SubmitExamResponse, Error, { provaId: number }>({
        mutationFn: ({ provaId }) => submitCandidateExamFinal(candidateId, provaId),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["candidate-exam", candidateId],
            });
            queryClient.invalidateQueries({
                queryKey: ["info-gerais-candidatura"],
            });

           
        },

        onError: (error) => {
            console.error("Erro ao submeter exame:", error.message);
        },
    });
}
