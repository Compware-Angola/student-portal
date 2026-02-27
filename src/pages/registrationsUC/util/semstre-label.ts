const definirSemestreLabel = (semestre?: number) => {
  if (!semestre) return "";
  if (semestre == 1) return "I Semestre";
  if (semestre == 2) return "II Semestre";
}

export {definirSemestreLabel}