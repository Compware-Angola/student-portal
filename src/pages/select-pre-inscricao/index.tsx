import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Calendar,
  GraduationCap,
  LogOut,
  MapPin,
  Plus,
  RefreshCw,
  FileText,
  BadgeCheck,
  LoaderCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { AuthStorage } from '@/storage/auth-storage'
import { useQueryPreInscricoes } from '@/hooks/profile/use-query-pre-inscricoes'
import { useQueryClient } from '@tanstack/react-query'
import type { PreInscricaoResumo } from '@/services/auth/pre-inscricoes.service'
import { getProfile } from '@/services/profile'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetPrazoPorTipo } from '@/hooks/prazos'
import { TipoCalendario } from '@/enums/tipo-calendario.enum'
import { useQueryUsableAcademicYear } from '@/hooks/academic-year/use-query-usable-academic-year'
import logo from '@/assets/logo_uma.png'
import { LogoBackground } from '@/pages/login/components/logo-background'
import { TipoCandidaturaModal } from './components/tipo-candidatura-modal'
import {
  buildPreInscricaoPath,
  type TipoCandidaturaPathType,
} from '@/pages/pre-subscription/tipo-candidatura'

function formatPreInscricaoDate(dateString?: string | null): string {
  if (!dateString) return 'Data não disponível'

  try {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: pt,
    })
  } catch {
    return 'Data não disponível'
  }
}

export function SelectPreInscricao() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setTheme } = useTheme()

  const { preInscricoes, isLoading, isError, refetch } = useQueryPreInscricoes()
  const user = AuthStorage.get()
  const selectedPreInscricao = AuthStorage.getSelectedPreinscricao()
  const [loadingCodigo, setLoadingCodigo] = useState<number | null>(null)
  const [modalAberto, setModalAberto] = useState(false)

  // Prazo de inscrição de novos estudantes (mesma lógica do login)
  const { data: anoLicenciatura } = useQueryUsableAcademicYear(1)
  const { data: anoMestrado } = useQueryUsableAcademicYear(2)
  const { data: anoDoutoramento } = useQueryUsableAcademicYear(3)

  const { data: prazoLicenciatura } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 1,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoLicenciatura?.codigo,
    },
    Boolean(anoLicenciatura?.codigo),
  )
  const { data: prazoMestrado } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 2,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoMestrado?.codigo,
    },
    Boolean(anoMestrado?.codigo),
  )
  const { data: prazoDoutoramento } = useGetPrazoPorTipo(
    {
      codigo_tipo_candidatura: 3,
      tipo: TipoCalendario.INSCRICAO_ESTUDANTES_NOVO,
      anoLectivo: anoDoutoramento?.codigo,
    },
    Boolean(anoDoutoramento?.codigo),
  )

  const podeAdicionarNovaPreInscricao = [
    prazoLicenciatura,
    prazoMestrado,
    prazoDoutoramento,
  ].some((prazo) => prazo?.podeInscrever)

  // Pré-inscrição mais recente do candidato (já vem ordenada do mais recente)
  const preInscricaoMaisRecente = preInscricoes[0]

  const anoAtualPorTipo: Record<number, number | undefined> = {
    1: anoLicenciatura?.codigo,
    2: anoMestrado?.codigo,
    3: anoDoutoramento?.codigo,
  }

  // Impede nova pré-inscrição quando a mais recente já é deste ano letivo
  let inscritoNoAnoAtual = false
  if (
    preInscricaoMaisRecente &&
    preInscricaoMaisRecente.ano_lectivo != null &&
    preInscricaoMaisRecente.codigo_tipo_candidatura != null
  ) {
    inscritoNoAnoAtual =
      Number(preInscricaoMaisRecente.ano_lectivo) ===
      anoAtualPorTipo[preInscricaoMaisRecente.codigo_tipo_candidatura]
  }

  const podeAdicionarNovaPreInscricaoFinal =
    podeAdicionarNovaPreInscricao && !inscritoNoAnoAtual

  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  async function handleSelect(preInscricao: PreInscricaoResumo) {
    if (loadingCodigo !== null) return

    const hadSelection = AuthStorage.getSelectedPreinscricao() !== null

    setLoadingCodigo(preInscricao.codigo_preinscricao)
    AuthStorage.saveSelectedPreinscricao(preInscricao.codigo_preinscricao)

    // Remove o perfil antigo e carrega o novo ANTES de navegar,
    // para a próxima página já abrir com os dados da pré-inscrição escolhida.
    queryClient.removeQueries({ queryKey: ['profile'] })

    try {
      await queryClient.fetchQuery({
        queryKey: ['profile', preInscricao.codigo_preinscricao, 'normal'],
        queryFn: () => getProfile(),
        staleTime: Infinity,
      })
    } catch {
      // Se falhar, a navegação continua — o guard/overlay tratará do erro
    } finally {
      setLoadingCodigo(null)
    }

    navigate(hadSelection ? '/' : '/comunicado')
  }

  function handleLogout() {
    AuthStorage.clear()
    window.location.href = '/auth'
  }

  function handleSelectTipo(tipo: TipoCandidaturaPathType) {
    setModalAberto(false)
    navigate(buildPreInscricaoPath(tipo))
  }

  const firstName = user?.user_name?.trim().split(' ')[0] ?? ''

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-[#3a0808] via-[#6b1010] to-[#E02020]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,white 39px,white 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,white 39px,white 40px)',
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-5 pb-0 flex items-center justify-between">
          <img
            src={logo}
            alt="Universidade Metodista de Angola"
            className="h-9 w-auto brightness-0 invert opacity-90"
          />
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-8 pb-14">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="h-5 w-5 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/60 font-semibold mb-1">
                {firstName ? `Olá, ${firstName}` : 'Portal do Estudante'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Selecione a sua Inscrição
              </h1>
              <p className="text-white/75 mt-2.5 text-sm sm:text-[15px] leading-relaxed">
                Escolha a inscrição com a qual pretende entrar no portal. Os
                dados apresentados serão carregados de acordo com a sua seleção.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
      </section>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 pb-16 relative">
        <LogoBackground bottom="2rem" left="2rem" />

        {isLoading && <SkeletonList />}

        {!isLoading && isError && <ErrorState onRetry={refetch} />}

        {!isLoading && !isError && preInscricoes.length === 0 && (
          <EmptyState
            onCreate={() => setModalAberto(true)}
            podeInscrever={podeAdicionarNovaPreInscricao}
          />
        )}

        {!isLoading && !isError && preInscricoes.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preInscricoes.map((pre) => (
              <PreInscricaoCard
                key={pre.codigo_preinscricao}
                preInscricao={pre}
                isSelected={pre.codigo_preinscricao === selectedPreInscricao}
                isLoading={loadingCodigo === pre.codigo_preinscricao}
                disabled={loadingCodigo !== null}
                onSelect={() => handleSelect(pre)}
              />
            ))}

            {podeAdicionarNovaPreInscricaoFinal && (
              <button
                onClick={() => setModalAberto(true)}
                className="group min-h-[190px] rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 hover:border-[#E02020]/50 hover:bg-white transition-all duration-200 flex flex-col items-center justify-center gap-3 p-6 text-slate-500 hover:text-[#E02020]"
              >
                <div className="h-11 w-11 rounded-full bg-slate-100 group-hover:bg-[#E02020]/10 flex items-center justify-center transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">
                  Adicionar nova inscrição
                </span>
                <span className="text-xs text-slate-400 max-w-[200px] text-center">
                  Candidate-se a outro curso ou regime de candidatura
                </span>
              </button>
            )}
          </div>
        )}
      </main>

      <TipoCandidaturaModal
        open={modalAberto}
        onOpenChange={setModalAberto}
        onSelect={handleSelectTipo}
      />
    </div>
  )
}

function PreInscricaoCard({
  preInscricao,
  isSelected,
  isLoading,
  disabled,
  onSelect,
}: {
  preInscricao: PreInscricaoResumo
  isSelected: boolean
  isLoading: boolean
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col',
        isSelected
          ? 'border-[#E02020]/50 shadow-[0_0_0_2px_rgba(224,32,32,0.15)] shadow-md'
          : 'border-slate-200/80 hover:border-[#E02020]/40 hover:shadow-md hover:shadow-[#E02020]/5',
      )}
    >
      <div className="h-1 w-full bg-gradient-to-r from-[#E02020] to-[#F5A623]" />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#E02020]/10 text-[#E02020] flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 leading-snug line-clamp-2">
                {preInscricao.curso ?? 'Curso não informado'}
              </h3>
              {isSelected && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#E02020]/10 text-[#E02020] border border-[#E02020]/20">
                  <BadgeCheck className="h-3 w-3" />
                  Atual
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-xs font-medium text-slate-600 line-clamp-1">
                {preInscricao.tipo_candidatura ??
                  'Tipo de candidatura não informado'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{preInscricao.polo ?? 'Polo não informado'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {formatPreInscricaoDate(preInscricao.data_preinscricao)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Inscrição n.º {preInscricao.codigo_preinscricao}</span>
          </div>
        </div>

        <button
          onClick={onSelect}
          disabled={disabled}
          className={cn(
            'mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
            'bg-[#E02020] text-white hover:bg-[#c01818] active:bg-[#a81414]',
            disabled && 'opacity-60 pointer-events-none',
          )}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />A entrar...
            </>
          ) : (
            <>
              Entrar com esta Inscrição
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center max-w-lg mx-auto">
      <p className="text-sm font-semibold text-slate-900">
        Não foi possível carregar as suas pré-inscrições
      </p>
      <p className="text-xs text-slate-500 mt-2">
        Verifique a sua ligação à internet e tente novamente.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center justify-center gap-2 bg-[#E02020] hover:bg-[#c01818] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </button>
    </div>
  )
}

function EmptyState({
  onCreate,
  podeInscrever,
}: {
  onCreate: () => void
  podeInscrever: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center max-w-lg mx-auto">
      <div className="h-12 w-12 rounded-full bg-[#E02020]/10 text-[#E02020] flex items-center justify-center mx-auto">
        <FileText className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-slate-900 mt-4">
        Ainda não possui nenhuma pré-inscrição
      </p>
      {podeInscrever ? (
        <>
          <p className="text-xs text-slate-500 mt-2">
            Crie a sua primeira pré-inscrição para começar a utilizar o portal.
          </p>
          <button
            onClick={onCreate}
            className="mt-5 inline-flex items-center justify-center gap-2 bg-[#E02020] hover:bg-[#c01818] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar pré-inscrição
          </button>
        </>
      ) : (
        <p className="text-xs text-slate-500 mt-2">
          O prazo de inscrição de novos estudantes está encerrado.
        </p>
      )}
    </div>
  )
}
