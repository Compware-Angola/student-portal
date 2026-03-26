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
import { Download, Loader2, Printer } from 'lucide-react'

import { formatDate } from '@/hooks/profile/use-query-profile'

// --------------------------------------------------------------------- Tipagem
interface NotaPagamento {
  id: string
  numero: string
  tipo: 'propina' | 'servico' | 'melhoria' | 'inscricao' | string
  descricao: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  dataFactura: string
  status: 'concluido' | 'pendente' | 'vencida' | string
  metodoPagamento?:
    | 'cash'
    | 'transferencia'
    | 'muteu_cash'
    | 'deposito'
    | 'express'
    | 'por_referencia'
    | 'tpa'
    | string
  comprovante?: string
}

// --------------------------------------------------------------------- Estilos (iguais ao anterior, só alguns ajustes)
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff', fontSize: 10.5 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#d32f2f',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: { width: 110, height: 60 },
  companyInfo: { textAlign: 'right' },
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#0D1B48' },
  companyDetails: { fontSize: 9, color: '#444', marginTop: 3 },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  section: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: { fontWeight: 'bold', color: '#222' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    color: '#fff',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: '#0D1B48', color: '#fff' },
  cellHeader: {
    padding: 6,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  cell: {
    padding: 6,
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  totalBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f7ff',
    borderWidth: 2,
    borderColor: '#0D1B48',
    borderRadius: 6,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1B48',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#777',
  },
})

// --------------------------------------------------------------------- Helper
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
    value,
  )

const metodoLabel = (metodo?: string) => {
  const map: Record<string, string> = {
    cash: 'Numerário',
    transferencia: 'Transferência Bancária',
    muteu_cash: 'Muteu Cash',
    deposito: 'Depósito',
    express: 'Express',
    por_referencia: 'Referência Multicaixa',
    tpa: 'TPA',
  }
  return metodo ? (map[metodo] ?? metodo) : '—'
}

const statusBadgeStyle = (status: string) => {
  switch (status) {
    case 'concluido':
      return { backgroundColor: '#10b981' }
    case 'pendente':
      return { backgroundColor: '#f59e0b' }
    case 'vencida':
      return { backgroundColor: '#ef4444' }
    default:
      return { backgroundColor: '#6b7280' }
  }
}

// --------------------------------------------------------------------- Documento PDF
const ComprovantePagamentoDocument = ({
  payment,
}: {
  payment: NotaPagamento
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo_uma.png" />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>
            Universidade Metodista de Angola
          </Text>
          <Text style={styles.companyDetails}>
            Rua Nossa Senhora da Muxima Nº 10, Kinaxixi, Luanda
          </Text>
          <Text style={styles.companyDetails}>NIF: 5401150865</Text>
          <Text style={styles.companyDetails}>
            Tel: +244 912 131 138 | Email: geral@uma.co.ao
          </Text>
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>Comprovativo de Pagamento</Text>

      {/* Informações principais */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Número:</Text> {payment.numero}
          </Text>
          <Text>
            <Text style={styles.label}>Tipo:</Text>{' '}
            <Text style={{ textTransform: 'capitalize' }}>{payment.tipo}</Text>
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.row}>
            <Text>
              <Text style={styles.label}>Data de Pagamento:</Text>{' '}
              {formatDate(payment.dataEmissao)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text>
            <Text style={styles.label}>Estado:</Text>{' '}
            <View style={[styles.badge, statusBadgeStyle('concluido')]}>
              {payment.status === 'concluido'
                ? 'Concluído'
                : payment.status === 'pendente'
                  ? 'Pendente'
                  : payment.status === 'vencida'
                    ? 'Vencido'
                    : payment.status}
            </View>
          </Text>
          <Text>
            <Text style={styles.label}>Método:</Text>{' '}
            {metodoLabel(payment.metodoPagamento)}
          </Text>
        </View>
      </View>

      {/* Descrição */}
      {payment.descricao && (
        <View style={styles.section}>
          <Text style={styles.label}>Descrição</Text>
          <Text style={{ marginTop: 4, fontSize: 11 }}>
            {payment.descricao}
          </Text>
        </View>
      )}

      {/* Tabela de valores */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text
            style={[styles.cellHeader, { width: '70%', textAlign: 'left' }]}
          >
            Descrição
          </Text>
          <Text style={[styles.cellHeader, { width: '30%' }]}>Valor</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { width: '70%', textAlign: 'left' }]}>
            {payment.tipo} – {payment.descricao || 'Pagamento'}
          </Text>
          <Text style={[styles.cell, { width: '30%', textAlign: 'right' }]}>
            {formatCurrency(payment.valor)}
          </Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Pago: {formatCurrency(payment.valor)}
        </Text>
      </View>

      {/* Aviso */}
      <View
        style={{
          marginTop: 30,
          padding: 12,
          backgroundColor: '#fef3c7',
          borderRadius: 6,
        }}
      >
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#92400e' }}>
          Este documento serve apenas como comprovativo de pagamento. Não possui
          validade fiscal para efeitos contabilísticos.
        </Text>
      </View>

      {/* Rodapé */}
      <Text style={styles.footer}>
        Emitido automaticamente pela Universidade Metodista de Angola ©{' '}
        {new Date().getFullYear()}
      </Text>
    </Page>
  </Document>
)

// --------------------------------------------------------------------- Componente React (botões de download/impressão)
export function ComprovantePagamento({
  payment,
  showDownloadButton = true,
  showPrintButton = true,
}: {
  payment: NotaPagamento
  showDownloadButton?: boolean
  showPrintButton?: boolean
}) {
  const document = <ComprovantePagamentoDocument payment={payment} />

  const handlePrint = async () => {
    try {
      const blob = await pdf(document).toBlob()
      const url = URL.createObjectURL(blob)
      const win = window.open(url, '_blank')
      win?.focus()
      setTimeout(() => win?.print(), 800)
    } catch (err) {
      console.error('Erro ao imprimir comprovativo', err)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showDownloadButton && (
        <PDFDownloadLink
          document={document}
          fileName={`Comprovativo_Pagamento_UMA_${payment.numero}.pdf`}
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              size="sm"
              className="w-full sm:w-auto"
              variant={loading ? 'secondary' : 'default'}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A gerar
                  PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Descarregar Comprovativo
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {showPrintButton && (
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default ComprovantePagamento
