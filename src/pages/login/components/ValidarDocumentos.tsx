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

import { useValidateDocument } from '@/hooks/docs/use-validate-document';


// ─── UI auxiliar ───────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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
    const [inputCodigo, setInputCodigo] = useState('')
    const [codigoAtivo, setCodigoAtivo] = useState('')

    const {
        data: doc,
        isLoading,
        isError,
        isFetched,
        refetch,
    } = useValidateDocument(codigoAtivo)

    const handleValidar = () => {
        setCodigoAtivo(inputCodigo.trim())
        refetch()
    }

    const isValido = isFetched && !!doc && !isError
    const isInvalido = isFetched && (isError || !doc)

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
                <CardTitle className="text-2xl">Validar Documentos</CardTitle>
                <CardDescription>
                    Verifique a autenticidade dos documentos
                </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="space-y-6">
                {/* FORM */}
                <div className="space-y-4">
                    <div>
                        <Label>Código</Label>
                        <Input
                            className="w-full"
                            value={inputCodigo}
                            onChange={(e) => setInputCodigo(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleValidar()}
                            placeholder="Insira o código do documento"
                        />
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleValidar}
                        disabled={isLoading || !inputCodigo.trim()}
                    >
                        {isLoading ? 'Validando...' : 'Validar'}
                    </Button>
                </div>

                {/* RESULTADO VÁLIDO */}
                {isValido && doc && (
                    <div className="border rounded-xl p-4 bg-green-50">
                        <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                            <CheckCircle2 className="h-5 w-5" />
                            Documento válido
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InfoRow icon={User} label="Aluno" value={doc.nome_completo} />
                            <InfoRow icon={Hash} label="Nº Matrícula" value={String(doc.codigo_matricula)} />
                            <InfoRow icon={BookOpen} label="Curso" value={doc.curso} />
                            <InfoRow icon={Calendar} label="Data de Registo" value={doc.data_registo} />
                            <InfoRow icon={User} label="Faculdade" value={doc.faculdade} />
                            <InfoRow icon={BookOpen} label="Tipo de Documento" value={doc.tipo_documento} />
                        </div>
                    </div>
                )}

                {/* RESULTADO INVÁLIDO */}
                {isInvalido && (
                    <div className="border rounded-xl p-4 bg-red-50 text-red-600">
                        <div className="flex items-center gap-2 font-semibold">
                            <XCircle className="h-5 w-5" />
                            Documento inválido ou não encontrado
                        </div>
                    </div>
                )}
            </CardContent>
        </div>
    )
}

export default ValidarDocumentos