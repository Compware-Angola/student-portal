
import { examApi } from "@/lib/exam-api";
export type ExamResponse = {
    provaId: number;
    perguntas: Question[];
};

export type Question = {
    id: number;
    pergunta: string;
    tipoPerguntaId: number;
    tipoPergunta: string;
    disciplinaId: number;
    disciplina: string;
    criadoEm: string;
    atualizadoEm: string;
    respostas: Answer[];
};

export type Answer = {
    id: number;
    resposta: string;
    tipoRespostaId: number;
    tipoResposta: "Verdadeira" | "Falso" | string;
    criadoEm: string;
    atualizadoEm: string;
};

export async function fetchCandidateExam(candidateId: number): Promise<ExamResponse> {
    const data = await examApi
        .get(`candidate-exam/${candidateId}`)
        .json<ExamResponse>();

    return data;
}

