'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'


import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    FileSearch,

    Calendar,
    User,
    BookOpen,

    Hash,

} from 'lucide-react'

// ─── Tipos ─────────────────────────────────────
type DocumentoValido = {
    codigo: string
    tipo: string
    aluno: string
    numeroEstudante: string
    curso: string
    dataEmissao: string
    emitidoPor: string
    finalidade: string
    validade?: string
}

type ResultadoEstado = 'idle' | 'valido' | 'invalido'

// ─── Mock ─────────────────────────────────────
const documentosMock: DocumentoValido[] = [
    {
        codigo: '9876543210987',
        tipo: 'declaracao',
        aluno: 'João Manuel da Silva',
        numeroEstudante: '20210456',
        curso: 'Engenharia Informática',
        dataEmissao: '15/03/2025',
        emitidoPor: 'Secretaria Académica — UMA',
        finalidade: 'Apresentação a entidade empregadora',
        validade: '15/09/2025',
    },
]


// ─── UI auxiliar ───────────────────────────────
function InfoRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
            </div>
        </div>
    )
}

// ─── Componente ───────────────────────────────
const ValidarDocumentos = ({ onBack }: { onBack: () => void }) => {

    const [codigo, setCodigo] = useState('')
    const [resultado, setResultado] = useState<ResultadoEstado>('idle')
    const [doc, setDoc] = useState<DocumentoValido | null>(null)
    const [loading, setLoading] = useState(false)

    const handleValidar = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        setTimeout(() => {
            const found = documentosMock.find(
                (d) =>
                    d.codigo.toLowerCase() === codigo.toLowerCase()
            )

            if (found) {
                setDoc(found)
                setResultado('valido')
            } else {
                setResultado('invalido')
            }

            setLoading(false)
        }, 600)
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Voltar */}
            <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>

            {/* Header */}
            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    <div className="bg-primary/10 p-3 rounded-xl">
                        <FileSearch className="h-6 w-6 text-primary" />
                    </div>
                </div>

                <CardTitle className="text-2xl">
                    Validar Documentos
                </CardTitle>

                <CardDescription>
                    Verifique a autenticidade dos documentos
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-6">
                {/* FORM */}
                <form onSubmit={handleValidar} className="space-y-4">
                    <div className="grid sm:grid-cols-1 gap-4">

                        <div>
                            <Label>Código</Label>
                            <Input className='w-full'
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button className="w-full" disabled={loading}>
                        {loading ? 'Validando...' : 'Validar'}
                    </Button>
                </form>

                {/* RESULTADO */}
                {resultado === 'valido' && doc && (
                    <div className="border rounded-xl p-4 bg-green-50">
                        <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                            <CheckCircle2 className="h-5 w-5" />
                            Documento válido
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InfoRow icon={User} label="Aluno" value={doc.aluno} />
                            <InfoRow icon={Hash} label="Código" value={doc.codigo} />
                            <InfoRow icon={BookOpen} label="Curso" value={doc.curso} />
                            <InfoRow icon={Calendar} label="Emissão" value={doc.dataEmissao} />
                        </div>
                    </div>
                )}

                {resultado === 'invalido' && (
                    <div className="border rounded-xl p-4 bg-red-50 text-red-600">
                        <div className="flex items-center gap-2 font-semibold">
                            <XCircle className="h-5 w-5" />
                            Documento inválido
                        </div>
                    </div>
                )}
            </CardContent>
        </div>
    )
}

export default ValidarDocumentos