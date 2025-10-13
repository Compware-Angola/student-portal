type HeaderWelcomeProps = {
  gender: string
  firstName: string
  lastName: string
  curriculumYear: string
}

export function HeaderWelcome(props: HeaderWelcomeProps) {
  const { gender, firstName, lastName, curriculumYear } = props

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {gender === 'Feminino' ? 'Bem-vinda' : 'Bem-vindo'},{' '}
        <span>{`${firstName} ${lastName}`}</span>
      </h1>
      <p className="text-muted-foreground">{curriculumYear}</p>
    </div>
  )
}
