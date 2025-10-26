import { FileText, GraduationCap, User } from 'lucide-react'
import { PersonalDataKeys } from '../schemas/personal-data.schema'
import { PersonalDetails } from './personal-details'
import { AcademicData } from './academic-data'
import { AcademicDataKeys } from '../schemas/academic-data.schema'
import { DocumentKeys } from '../schemas/documents.schema'
import { AcademicDocument } from './academic-document'

export const steps = [
  {
    id: 'personalData',
    component: <PersonalDetails />,
    fields: PersonalDataKeys,
    number: 0,
    title: 'Dados Pessoais',
    description: 'Preencha as suas informações pessoais',
    icon: User,
  },
  {
    id: 'academicData',
    component: <AcademicData />,
    fields: AcademicDataKeys,
    number: 1,
    title: 'Dados Académicos',
    description: 'Informações sobre o curso e histórico académico',
    icon: GraduationCap,
  },
  {
    id: 'documents',
    component: <AcademicDocument />,
    fields: DocumentKeys,
    number: 2,
    title: 'Dados da Candidatura',
    description: 'Informações sobre Dados da Candidatura',
    icon: FileText,
  },
]
