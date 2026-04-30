import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '@/error'
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
  email:z.string().email({ message: 'Email inválido' }).optional(),
  password: z.string().min(1, { message: 'Senha é obrigatória' }),
  faculdade: z.string().min(1, { message: 'Faculdade é obrigatório' }),
  grauacademico: z.string().min(1, { message: 'Faculdade é obrigatório' }),
})

export type RegisterFormData = z.infer<typeof FormSchema>

export function useRegisterForm() {
  const navigate = useNavigate()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numero_documento: '',
      name: '',
      telefone: '',
      email: '',
      password: '',
      tipo_de_documento: '',
      faculdade: '',
      grauacademico: '',
    },
  })
  const { data: faculdade } = useQueryFetchFaculdades()
  const { data: tipoCandidaturas } = useQueryTipoCandidatura()
  const { data: tipoDocumentos } = useQueryTipoDocumento()
  const { createBeginningStudentProcessAsync } =
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
    console.log("entrou aqui")
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
        faculdade: data.faculdade,
      })
      toast.success('Autenticado com sucesso!')
      console.log(data)
      //navigate('/')
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error('Dados inválidos, verifique os campos.')
            break
          case 401:
            toast.error('Credenciais inválidas, tente novamente.')
            break
          case 500:
            toast.error('Erro no servidor. Tente mais tarde.')
            break
          default:
            toast.error('Erro desconhecido contacte suporte.')
        }
        return
      }
      toast.error('Erro desconhecido contacte suporte.')
    }
  }

  return {
    form,
    onSubmit,
    faculdadesOptions,
    tipoCandidaturaOptions,
    tipoDocumentoOptions,
  }
}
