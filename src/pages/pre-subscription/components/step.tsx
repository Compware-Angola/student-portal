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
    description: 'Preencha as suas informações pessoais',
    icon: User,
  },
  {
    id: 'personalData2',
    component: <PersonalDetails />,
    fields: PersonalDataKeys,
    number: 2,
    title: 'Dados Pessoais',
    icon: User,
  },
]
