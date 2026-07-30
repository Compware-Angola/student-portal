// components/enrollment-deadline-expired.tsx
interface EnrollmentDeadlineExpiredProps {
  aindaNaoComecou?: boolean
}

export function EnrollmentDeadlineExpired({
  aindaNaoComecou,
}: EnrollmentDeadlineExpiredProps) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <h3 className="text-lg font-semibold">
        {aindaNaoComecou
          ? 'O período de matrícula ainda não começou'
          : 'O prazo de matrícula terminou'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {aindaNaoComecou
          ? 'Volta a esta página assim que o período de matrículas abrir.'
          : 'Já não é possível efetuar matrículas neste período.'}
      </p>
    </div>
  )
}