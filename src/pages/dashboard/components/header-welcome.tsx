type HeaderWelcomeProps = {
  gender: string
  firstName: string
  lastName: string
  curriculumYear?: string
  enrollmentState?: string
}

export function HeaderWelcome(props: HeaderWelcomeProps) {
  const { gender, firstName, lastName, curriculumYear, enrollmentState } = props
  const greeting = gender === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'
  const textToDisplay = curriculumYear || enrollmentState

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, <span>{`${firstName} ${lastName}`}</span>
      </h1>
      {textToDisplay && (
        <p className="text-muted-foreground">{textToDisplay}</p>
      )}
    </div>
  )
}
