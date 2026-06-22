import { examApi } from "@/lib/exam-api";

export type SubmitAnswer = {
  perguntaId: number;
  respostaId: number;
};

export type SubmitExamRequest = {
  provaId: number;
  respostas: SubmitAnswer[];
};

export type SubmitExamResponse = {
  message: string;
  candidatoId: number;
  provaId: number;
  totalRespostas: number;
};
export async function submitCandidateExam(
  candidateId: number,
  payload: SubmitExamRequest
): Promise<SubmitExamResponse> {
  const data = await examApi
    .post(`candidate-exam/${candidateId}/respostas`, {
      json: payload,
    })
    .json<SubmitExamResponse>();

  return data;
}



export async function submitCandidateExamFinal(candidateId: number, provaId: number): Promise<SubmitExamResponse> {
  const data = await examApi
    .patch(`candidate-exam/${candidateId}/finalizar/${provaId}`)
    .json<SubmitExamResponse>();

  return data;
}


