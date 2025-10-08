import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Nome de usuário é obrigatório",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
})

export type LoginFormData = z.infer<typeof FormSchema>

export function useLoginForm() {
  // 1️⃣ Configura o formulário
  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // 2️⃣ Define o comportamento ao submeter
  function onSubmit(data: LoginFormData) {
    console.log("Dados de login:", data)
    // Aqui pode chamar API de autenticação, redirecionar, etc.
  }

  // 3️⃣ Retorna o que o componente precisa
  return { form, onSubmit }
}
