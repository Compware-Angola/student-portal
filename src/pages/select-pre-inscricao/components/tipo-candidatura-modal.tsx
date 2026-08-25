import { Award, ArrowRight, BookOpen, GraduationCap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  TipoCandidaturaPath,
  type TipoCandidaturaPathType,
} from '@/pages/pre-subscription/tipo-candidatura'

interface TipoCandidaturaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (tipo: TipoCandidaturaPathType) => void
}

const OPTIONS: {
  tipo: TipoCandidaturaPathType
  titulo: string
  descricao: string
  icon: typeof GraduationCap
}[] = [
  {
    tipo: TipoCandidaturaPath.LICENCIATURA,
    titulo: 'Licenciatura',
    descricao: 'Candidatura a um curso de licenciatura.',
    icon: GraduationCap,
  },
  {
    tipo: TipoCandidaturaPath.MESTRADO,
    titulo: 'Mestrado',
    descricao: 'Candidatura a um curso de mestrado (pós-graduação).',
    icon: BookOpen,
  },
  {
    tipo: TipoCandidaturaPath.DOUTORAMENTO,
    titulo: 'Doutoramento',
    descricao: 'Candidatura a um curso de doutoramento (pós-graduação).',
    icon: Award,
  },
]

export function TipoCandidaturaModal({
  open,
  onOpenChange,
  onSelect,
}: TipoCandidaturaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova inscrição</DialogTitle>
          <DialogDescription>
            Selecione o tipo de candidatura para definirmos o formulário
            correto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon

            return (
              <button
                key={opt.tipo}
                type="button"
                onClick={() => onSelect(opt.tipo)}
                className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-150 hover:border-[#E02020]/50 hover:shadow-md"
              >
                <div className="h-10 w-10 rounded-xl bg-[#E02020]/10 text-[#E02020] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{opt.titulo}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {opt.descricao}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E02020]">
                  Continuar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
