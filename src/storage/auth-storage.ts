// src/lib/storage/auth-storage.ts
type AuthData = {
  token: string
  user_id: number
  user_name: string
  codigoPreinscricao: number
}

const STORAGE_KEY = '@academico:auth'
const PREINSCRICAO_SELECIONADA_KEY = '@academico:preinscricao-selecionada'
export const AuthStorage = {
  /**
   * Salva os dados de autenticação no localStorage.
   * @param data Dados de autenticação retornados pela API.
   */
  save(data: AuthData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      this.clearSelectedPreinscricao()
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error)
    }
  },

  /**
   * Retorna os dados de autenticação armazenados.
   * @returns {AuthData | null}
   */
  get(): AuthData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as AuthData) : null
    } catch (error) {
      console.error('Erro ao ler dados de autenticação:', error)
      return null
    }
  },

  /**
   * Retorna apenas o token salvo (caso exista).
   */
  getToken(): string | null {
    return this.get()?.token ?? null
  },

  /**
   * Remove completamente os dados de autenticação.
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erro ao limpar autenticação:', error)
    }
  },

  isAuthenticated(): boolean {
    const auth = this.get()
    return !!auth?.token
  },

  /**
   * Guarda o código da pré-inscrição selecionada pelo estudante.
   */
  saveSelectedPreinscricao(codigo: number): void {
    try {
      localStorage.setItem(PREINSCRICAO_SELECIONADA_KEY, JSON.stringify(codigo))
    } catch (error) {
      console.error('Erro ao guardar pré-inscrição selecionada:', error)
    }
  },

  /**
   * Retorna o código da pré-inscrição selecionada (ou null).
   */
  getSelectedPreinscricao(): number | null {
    try {
      const raw = localStorage.getItem(PREINSCRICAO_SELECIONADA_KEY)
      return raw ? (JSON.parse(raw) as number) : null
    } catch (error) {
      console.error('Erro ao ler pré-inscrição selecionada:', error)
      return null
    }
  },

  /**
   * Remove a pré-inscrição selecionada.
   */
  clearSelectedPreinscricao(): void {
    try {
      localStorage.removeItem(PREINSCRICAO_SELECIONADA_KEY)
    } catch (error) {
      console.error('Erro ao limpar pré-inscrição selecionada:', error)
    }
  },
}
