import { User } from 'lucide-react'
import { PersonalDataKeys } from '../schemas/personal-data.schema'
import { PersonalDetails } from './personal-details'

export const steps = [
  {
    id: 'personalData',
    component: <PersonalDetails />,
    fields: PersonalDataKeys,
    number: 1,
    title: 'Dados Pessoais',
    icon: User,
  },
]
// {  },
// { number: 2, title: 'Dados Académicos', icon: GraduationCap },
// { number: 3, title: 'Dados da Candidatura', icon: FileText },
// { number: 4, title: 'Revisão', icon: CheckCheck },
