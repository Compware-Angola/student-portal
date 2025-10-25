export const Semester = {
  FIRST: 'I SEMESTRE',
  SECOND: 'II SEMESTRE',
} as const

export type Semester = (typeof Semester)[keyof typeof Semester]
