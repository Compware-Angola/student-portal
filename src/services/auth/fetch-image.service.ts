import { gaApi } from '@/lib/ga-api'

type ResponseGetImagem = {
  filename: string | null
}

export async function getAvisoImagem(): Promise<ResponseGetImagem> {
  const response = await gaApi.get<ResponseGetImagem>(
    "solicitacoa/aviso/imagem"
  )

  
  return  response.json()
}