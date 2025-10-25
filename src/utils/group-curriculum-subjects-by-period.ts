import type { NewStudentCurriculumSubject } from '@/services/curriculum/new-student-curriculum-plan.service'

export const DurationDiscipline = {
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
} as const

export const Semester = {
  FIRST: 'I SEMESTRE',
  SECOND: 'II SEMESTRE',
} as const

type NormalizedSubject = {
  valorInscricao: number
  disciplina: string
  semestre: string
  classe: string
  duracaoDisciplina: string
  codigoDisciplina: string
  codigoGrade: string
}

type NormalizedSubjects = {
  anualy: NormalizedSubject[]
  firstSemester: NormalizedSubject[]
  secondSemester: NormalizedSubject[]
}

function normalizeSubject(subject: NewStudentCurriculumSubject) {
  return {
    ...subject,
    valorInscricao: Number(subject.valorInscricao) || 0,
  }
}

export function groupCurriculumSubjectsByPeriod(
  subjects: NewStudentCurriculumSubject[],
): NormalizedSubjects {
  const filterSubjects = (
    filterFn: (s: NewStudentCurriculumSubject) => boolean,
  ) => subjects.filter(filterFn).map(normalizeSubject)

  return {
    anualy: filterSubjects(
      (s) => s.duracaoDisciplina === DurationDiscipline.ANUAL,
    ),
    firstSemester: filterSubjects(
      (s) =>
        s.duracaoDisciplina === DurationDiscipline.SEMESTRAL &&
        s.semestre === Semester.FIRST,
    ),
    secondSemester: filterSubjects(
      (s) =>
        s.duracaoDisciplina === DurationDiscipline.SEMESTRAL &&
        s.semestre === Semester.SECOND,
    ),
  }
}
