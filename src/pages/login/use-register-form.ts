import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useQueryFetchFaculdades } from '@/hooks/faculdade/use-query-faculdade'
import { useQueryTipoCandidatura } from '@/hooks/dropdowns/use-query-tipo-candidatura'
import { useQueryTipoDocumento } from '@/hooks/dropdowns/use-query-tipo-documento'
import { useMutationBeginningStudentProcess } from '@/hooks/users/use-mutation-create-user'

export const FormSchema = z.object({
  tipo_de_documento: z
    .string()
    .min(1, { message: 'Tipo de documento é obrigatório' }),
  numero_documento: z
    .string()
    .min(1, { message: 'Número de documento é obrigatório' }),
  name: z.string().min(1, { message: 'Nome de usuário é obrigatório' }),
  telefone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }).optional(),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'A senha deve conter pelo menos uma letra maiúscula' })
    .regex(/[a-z]/, { message: 'A senha deve conter pelo menos uma letra minúscula' })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número' })
    .regex(/[^A-Za-z0-9]/, { message: 'A senha deve conter pelo menos um caractere especial' }),
  grauacademico: z.string().min(1, { message: 'Faculdade é obrigatório' }),
  confirmar_senha: z.string().min(1, { message: 'Confirmação de senha é obrigatória' }),

}).refine((data) => data.password === data.confirmar_senha, {
  message: 'As senhas não coincidem',
  path: ['confirmar_senha'],
})

export type RegisterFormData = z.infer<typeof FormSchema>

export function useRegisterForm() {

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numero_documento: '',
      name: '',
      telefone: '',
      email: '',
      password: '',
      confirmar_senha: '',
      tipo_de_documento: '',
      grauacademico: '',
    },
  })
  const { data: faculdade } = useQueryFetchFaculdades()
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()
  const { data: tipoDocumentos } = useQueryTipoDocumento()
  const { createBeginningStudentProcessAsync, createBeginningStudentProcessPending } =
    useMutationBeginningStudentProcess()
  const faculdadesOptions =
    faculdade?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  const tipoCandidaturaOptions =
    tipoCandidaturas?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  const tipoDocumentoOptions =
    tipoDocumentos?.map((t) => ({
      label: t.designacao,
      value: String(t.codigo),
    })) ?? []

  async function onSubmit(data: RegisterFormData) {

    try {
      await createBeginningStudentProcessAsync({
        name: data.name,
        telefone: data.telefone,
        email: data.email,
        tipo_de_documento: Number(data.tipo_de_documento),
        numero_documento: data.numero_documento,
        password: data.password,
        canal: 3,
        grauacademico: data.grauacademico,
      })
      toast.success('Autenticado com sucesso!')

      //navigate('/')
    } catch (error) {
      throw new Error("Erro ao fazer registro")
    }
  }

  return {
    form,
    onSubmit,
    faculdadesOptions,
    tipoCandidaturaOptions,
    createBeginningStudentProcessPending,
    tipoDocumentoOptions,
  }
}
