import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import type { PreInscricaoFichaResponse } from '@/services/pre-inscrition/type'

// ─── Paleta ────────────────────────────────────────────────────────────────
const NAVY = '#0D1B48'
const RED = '#b71c1c'
const LIGHT_BG = '#f4f6fb'
const BORDER = '#d0d7e8'

// ─── Estilos ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    paddingHorizontal: 40,
    paddingVertical: 35,
  },

  // ── Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: RED,
    paddingBottom: 10,
    marginBottom: 14,
  },
  logo: { width: 90, height: 90 },
  companyBlock: { alignItems: 'flex-end' },
  companyName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: NAVY },
  companyLine: { fontSize: 8.5, color: '#444', marginTop: 3 },

  // ── Título do documento
  docTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  docSubtitle: {
    textAlign: 'center',
    fontSize: 9,
    color: '#555',
    marginBottom: 14,
  },

  // ── Secção / bloco
  section: { marginBottom: 11 },
  sectionHeader: {
    backgroundColor: NAVY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ── Linhas de campo
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  rowAlt: { backgroundColor: LIGHT_BG },
  fieldLabel: {
    width: '45%',
    fontSize: 9,
    color: '#555',
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111',
    textAlign: 'right',
  },

  // ── Opções de curso (tabela)
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: NAVY,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeadCell: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
  },
  tableBodyRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableBodyRowAlt: { backgroundColor: LIGHT_BG },
  tableCell: { fontSize: 9, color: '#222' },

  // ── Nota / aviso
  noteBox: {
    marginTop: 14,
    padding: 9,
    borderLeftWidth: 3,
    borderLeftColor: RED,
    backgroundColor: '#fdf3f4',
    borderRadius: 2,
  },
  noteLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  noteText: { fontSize: 8.5, color: '#555', lineHeight: 1.5 },

  // ── Rodapé
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: '#888' },
})

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt(dateStr?: string | null) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('pt-AO')
}

function Field({
  label,
  value,
  alt,
}: {
  label: string
  value?: string | number | null
  alt?: boolean
}) {
  return (
    <View style={[styles.row, alt ? styles.rowAlt : {}]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value ?? '—'}</Text>
    </View>
  )
}

function SectionBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

// ─── Documento PDF ──────────────────────────────────────────────────────────
function EnrollmentSheetDocument({
  data,
}: {
  data: PreInscricaoFichaResponse
}) {
  const {
    dados_pessoais,
    documento,
    formacao_anterior,
    candidatura,
    opcoes_curso,
  } = data

  const permitirInscricao = candidatura.permitir_inscricao

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── Cabeçalho ── */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo_uma.png" />
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>
              Universidade Metodista de Angola
            </Text>
            <Text style={styles.companyLine}>
              Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi, Luanda.
            </Text>
            <Text style={styles.companyLine}>NIF: 5401150865</Text>
            <Text style={styles.companyLine}>
              Tel: +244 912131138 / +244 947716133 / +244 942364667
            </Text>
            <Text style={styles.companyLine}>Email: geral@uma.co.ao</Text>
          </View>
        </View>

        {/* ── Título ── */}
        <Text style={styles.docTitle}>
          Ficha de Inscrição Nº: {candidatura.codigo_preinscricao}
        </Text>
        <Text style={styles.docSubtitle}>
          Ano Lectivo: {candidatura.ano_lectivo} &nbsp;|&nbsp;{' '}
          {candidatura.polo}
        </Text>

        {/* ── Dados Pessoais ── */}
        <SectionBlock title="Dados Pessoais">
          <Field
            label="Nome Completo do Estudante"
            value={fmt(dados_pessoais.nome_completo)}
          />
          <Field
            label="Estado Civil"
            value={fmt(dados_pessoais.estado_civil)}
            alt
          />
          <Field label="Género" value={fmt(dados_pessoais.sexo)} />
          <Field label="E-mail" value={fmt(dados_pessoais.email)} alt />
          <Field
            label="Telefone"
            value={fmt(dados_pessoais.contactos_telefonicos)}
          />
          <Field
            label="Contacto Alternativo"
            value={fmt(dados_pessoais.contacto_de_emergencia)}
            alt
          />
          <Field
            label="Data de Nascimento"
            value={fmt(dados_pessoais.data_nascimento)}
          />
          <Field
            label="Tipo de Documento de Identificação"
            value={`Bilhete de Identidade, Nº: ${fmt(documento.bilhete_identidade)}`}
            alt
          />
          <Field
            label="Necessidades Especiais"
            value={fmt(dados_pessoais.necessidade_especial)}
          />
        </SectionBlock>

        {/* ── Dados Académicos ── */}
        <SectionBlock title="Dados Académicos">
          <Field
            label="Média Final do Curso"
            value={formacao_anterior?.media_final ?? '-'}
          />
          <Field
            label="Data de Conclusão"
            value={fmt(formacao_anterior?.data_conclusao)}
            alt
          />
          <Field
            label="Instituição de Provenência"
            value={fmt(formacao_anterior?.instituicao_formacao)}
          />
          <Field
            label="Curso de Ensino Médio"
            value={fmt(formacao_anterior?.curso_ensino_medio)}
            alt
          />
        </SectionBlock>

        {/* ── Dados da Candidatura ── */}
        <SectionBlock title="Dados da Candidatura">
          {/* Tabela de opções */}
          <View style={[styles.table, { marginBottom: 8 }]}>
            <View style={styles.tableHead}>
              <Text style={[styles.tableHeadCell, { width: '10%' }]}>
                Opção
              </Text>
              <Text style={[styles.tableHeadCell, { flex: 1 }]}>
                Curso de Candidatura
              </Text>
              <Text
                style={[
                  styles.tableHeadCell,
                  { width: '22%', textAlign: 'right' },
                ]}
              >
                Turno
              </Text>
            </View>
            {opcoes_curso.map((op, i) => (
              <View
                key={op.opcao}
                style={[
                  styles.tableBodyRow,
                  i % 2 !== 0 ? styles.tableBodyRowAlt : {},
                ]}
              >
                <Text style={[styles.tableCell, { width: '10%' }]}>
                  {op.opcao}ª
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {op.designacao}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: '22%', textAlign: 'right' },
                  ]}
                >
                  {op.turno ?? '—'}
                </Text>
              </View>
            ))}
          </View>

          <Field
            label="Data da Candidatura"
            value={fmt(candidatura.data_candidatura)}
          />
          <Field
            label="Data da Última Actualização"
            value={fmt(candidatura.data_ultima_atualizacao)}
            alt
          />
          <Field
            label="Estado do Candidato"
            value={candidatura.estado_candidato}
          />
        </SectionBlock>

        {/* ── Nota ── */}
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Nota</Text>
          {permitirInscricao ? (
            <Text style={styles.noteText}>
              A sua candidatura foi validada. Pode proceder à inscrição.
            </Text>
          ) : (
            <Text style={styles.noteText}>
              Para validar a sua candidatura deve enviar o pagamento
              correspondente à taxa de candidatura. Após confirmação do
              pagamento, o acesso à inscrição será activado.
            </Text>
          )}
        </View>

        {/* ── Rodapé ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documento emitido automaticamente — Universidade Metodista de Angola
          </Text>
          <Text style={styles.footerText}>© {new Date().getFullYear()}</Text>
        </View>
      </Page>
    </Document>
  )
}
export const handleDownload = async (data: any) => {
  try {
    const blob = await pdf(<EnrollmentSheetDocument data={data} />).toBlob()

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `Ficha_Inscricao_UMA_${data.candidatura.codigo_preinscricao}.pdf`

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
  }
}
// ─── Componente exportado ───────────────────────────────────────────────────
export function EnrollmentSheet({
  data,
  showDownloadButton = true,
  showPrintButton = true,
}: {
  data: PreInscricaoFichaResponse | undefined
  showDownloadButton?: boolean
  showPrintButton?: boolean
}) {
  //const document = <EnrollmentSheetDocument data={data} />

  // const handlePrint = async () => {
  //   try {
  //     const blob = await pdf(document).toBlob()
  //     const fileURL = URL.createObjectURL(blob)
  //     const printWindow = window.open(fileURL)
  //     if (printWindow) {
  //       printWindow.focus()
  //       printWindow.print()
  //     } else {
  //       window.open(fileURL, '_blank')
  //     }
  //   } catch (error) {
  //     console.error('Erro ao gerar PDF para impressão', error)
  //   }
  // }

  return (
    <div className="flex items-center justify-end gap-2">
      {showDownloadButton && (
        <Button type='button' disabled={!data}  onClick={() => handleDownload(data)} className="flex-1" aria-label="Descarregar PDF">
          <Download className="mr-2 h-4 w-4" />
          {!data ? 'A gerar...' : 'Descarregar Ficha'}
        </Button>
        //<Button onClick={() => handleDownload(data)}>Download</Button>
        // <PDFDownloadLink
        //   document={document}
        //   fileName={`Ficha_Inscricao_UMA_${data.candidatura.codigo_preinscricao}.pdf`}
        // >
        //   {({ loading, error }) => {
        //     if (error) {
        //       console.log('Erro PDF:', error)
        //     }
        //     return (
        //       <Button
        //         className="flex-1"
        //         disabled={loading}
        //         aria-label="Descarregar PDF"
        //       >
        //         <Download className="mr-2 h-4 w-4" />
        //         {loading ? 'A gerar...' : 'Descarregar Ficha'}
        //       </Button>
        //     )
        //   }}
        // </PDFDownloadLink>
      )}

      {/* {showPrintButton && (
        <Button
          variant="outline"
          onClick={handlePrint}
          aria-label="Imprimir ficha"
        >
          <Printer className="h-4 w-4" />
        </Button>
      )} */}
    </div>
  )
}

export default EnrollmentSheet
