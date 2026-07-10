import { FileText, GraduationCap, Search, User } from 'lucide-react'
import { PersonalDataKeys } from '../schemas/personal-data.schema'
import { PersonalDetails } from './personal-details'
import { AcademicData } from './academic-data'
import { AcademicDataKeys } from '../schemas/academic-data.schema'
import { DocumentKeys } from '../schemas/documents.schema'
import { AcademicDocument } from './academic-document'
import { ContactData } from './contact-data'
import { ContactKeys } from '../schemas/contact-data.schema'
import { SurveyData } from './survey-data'
import { SurveyDataKeys } from '../schemas/survey-data.schema'
import { ResumeDetails } from './resume-details'

export const steps = [
  {
    id: 'personalData',
    component: PersonalDetails,
    fields: PersonalDataKeys,
    number: 0,
    title: 'Dados Pessoais',
    description: 'Preencha as suas informações pessoais',
    icon: User,
  },
  {
    id: 'academicData',
    component: AcademicData,
    fields: AcademicDataKeys,
    number: 1,
    title: 'Dados Académicos',
    description: 'Informações sobre o curso e histórico académico',
    icon: GraduationCap,
  },
  {
    id: 'documents',
    component: AcademicDocument,
    fields: DocumentKeys,
    number: 2,
    title: 'Dados da Candidatura',
    description: 'Informações sobre Dados da Candidatura',
    icon: FileText,
  },
  {
    id: 'contacts',
    component: ContactData,
    fields: ContactKeys,
    number: 3,
    title: 'Dados de Contactos',
    description: 'Informações sobre Dados da Contactos',
    icon: FileText,
    submitOnStep: true,
  },
  {
    id: 'survey',
    component: SurveyData,
    fields: SurveyDataKeys,
    number: 4,
    title: 'Inquérito',
    description: 'Como você chegou até a Universidade Metodista?',
    icon: Search,
  },
  {
    id: 'resume',
    component: ResumeDetails,
    fields: [],
    number: 5,
    title: 'Resumo',
    description: 'Informações sobre Candidatura',
    icon: FileText,
    isSummary: true,
  },
]
