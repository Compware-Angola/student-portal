import { FileText, User } from 'lucide-react'
import { PersonalDataKeys } from '../schemas/personal-data.schema'
import { PersonalDetailsPostGraduate } from './personal-details'
// import { AcademicData } from './academic-data'
// import { AcademicDataKeys } from '../schemas/academic-data.schema'
import { DocumentKeys } from '../schemas/documents.schema'
import { AcademicDocumentPostGraduate } from './academic-document'
import { ContactDataPostGraduate } from './contact-data'
import { ContactKeys } from '../schemas/contact-data.schema'
import { ResumeDetails } from './resume-details'

export const steps = [
  {
    id: 'personalData',
    component: PersonalDetailsPostGraduate ,
    fields: PersonalDataKeys,
    number: 0,
    title: 'Dados Pessoais',
    description: 'Preencha as suas informações pessoais',
    icon: User,
  },
  // {
  //   id: 'academicData',
  //   component: AcademicData ,
  //   fields: AcademicDataKeys,
  //   number: 1,
  //   title: 'Dados Académicos',
  //   description: 'Informações sobre o curso e histórico académico',
  //   icon: GraduationCap,
  // },
  {
    id: 'documents',
    component: AcademicDocumentPostGraduate,
    fields: DocumentKeys,
    number: 2,
    title: 'Dados da Candidatura',
    description: 'Informações sobre Dados da Candidatura',
    icon: FileText,
  },
  {
    id: 'contacts',
    component: ContactDataPostGraduate ,
    fields: ContactKeys,
    number: 3,
    title: 'Dados de Contactos',
    description: 'Informações sobre Dados da Contactos',
    icon: FileText,
    submitOnStep: true,
  },
  {
    id: 'resume',
    component: ResumeDetails ,
    fields: [],
    number: 4,
    title: 'Resumo',
    description: 'Informações sobre Candidatura',
    icon: FileText,
    isSummary: true,
  },
]
