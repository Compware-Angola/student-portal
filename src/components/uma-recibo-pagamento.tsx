import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import type { Invoice } from '@/services/invoice/get-invoices-by-matricula.service'
import { FileText, Loader2 } from 'lucide-react'

// Estilos refinados
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#d32f2f',
    paddingBottom: 8,
    marginBottom: 15,
  },
  logo: { width: 110, height: 60 },
  companyInfo: { textAlign: 'right' },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1b48',
  },
  companyDetails: {
    fontSize: 9,
    color: '#444',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginVertical: 10,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
  },
  value: {
    color: '#333',
  },
  paymentBox: {
    borderWidth: 1.5,
    borderColor: '#0d1b48',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f8f9fb',
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0d1b48',
    marginBottom: 4,
    textAlign: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#111',
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: 'row' },
  tableHeader: {
    backgroundColor: '#0d1b48',
    color: 'white',
    fontWeight: 'bold',
  },
  tableCellHeader: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  totalSection: {
    marginTop: 15,
    padding: 10,
    borderTopWidth: 2,
    borderColor: '#d32f2f',
    textAlign: 'right',
  },
  totalText: { fontSize: 12, fontWeight: 'bold', color: '#0d1b48' },
  nonFiscalBox: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#b71c1c',
    borderRadius: 6,
    backgroundColor: '#fdf3f4',
  },

  nonFiscalTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginBottom: 3,
    textTransform: 'uppercase',
  },

  nonFiscalText: {
    fontSize: 9,
    textAlign: 'center',
    color: '#444',
  },
  infoBox: {
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#90a4ae', // cinza azulado suave
    borderRadius: 6,
    backgroundColor: '#f1f4f6', // cinza claro elegante
  },

  infoText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#37474f', // cinza escuro moderno
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: 'center',
    color: '#777',
  },
})

function PaymentReceiptDocument({
  invoice,
}: {
  invoice: Invoice
  academicYear: string
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ---------- Cabeçalho ---------- */}

        <View style={styles.header}>
          <Image style={styles.logo} src="/logo_uma.png" />

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Universidade Metodista de Angola
            </Text>

            <Text style={[styles.companyDetails, { marginTop: 4 }]}>
              Luanda - Luanda.
            </Text>
            <Text style={[styles.companyDetails, { marginTop: 4 }]}>
              Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi, Luanda.
            </Text>
            <Text style={[styles.companyDetails, { marginTop: 4 }]}>
              NIF: 5401150865
            </Text>
            <Text style={[styles.companyDetails, { marginTop: 4 }]}>
              Tel: +244 912131138 / +244 947716133 / +244 942364667
            </Text>

            <Text style={[styles.companyDetails, { marginTop: 4 }]}>
              Email: geral@uma.co.ao
            </Text>
          </View>
        </View>

        {/* ---------- Título ---------- */}
        <Text style={styles.title}>Nota de Pagamento</Text>

        {/* ---------- Informações principais ---------- */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Codigo:</Text> {invoice.Codigo}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Número de doc*:</Text>{' '}
              {invoice.Referencia}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Data Emissão:</Text>{' '}
              {new Date(invoice.DataFactura).toLocaleDateString()}
            </Text>

            {invoice.dataVencimento && (
              <Text>
                <Text style={styles.label}>Vencimento:</Text>{' '}
                {new Date(invoice.dataVencimento).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Ano Lectivo:</Text>{' '}
              {invoice?.ano_lectivo}
            </Text>
            <Text>
              <Text style={styles.label}>Polo:</Text> {invoice.polo}
            </Text>
          </View>
        </View>

        {/* ---------- Dados do Estudante ---------- */}
        <View style={styles.section}>
          <Text style={styles.label}>Dados do Estudante</Text>
          <Text>Nome: {invoice.NomeCompleto}</Text>
          <Text>Matrícula: {invoice.CodigoMatricula}</Text>
        </View>

        {/* ---------- Dados de Pagamento ---------- */}

        {/* ---------- Tabela de itens ---------- */}
        {/* ---------- Tabela de itens ---------- */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, { width: '60%' }]}>
              Descrição
            </Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>
              Valor (Kz)
            </Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>
              IVA (Kz)
            </Text>
          </View>

          {/* ✅ Mapeamento dos itens de invoice.itens */}
          {invoice.itens.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { width: '60%' }]}>
                {/* Use item.Descricao aqui */}
                {item.DescricaoServico || item.OBS || 'Sem descrição'}
              </Text>
              <Text
                style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
              >
                {/* Use item.TotalPreco aqui */}
                {Number(item.Total).toFixed(2)}
              </Text>
              <Text
                style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
              >
                {/* Use item.totalIVA aqui */}
                {Number(item.taxa_iva).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* ---------- Totais ---------- */}
        <View style={styles.totalSection}>
          <Text>Desconto: {Number(invoice.Desconto).toFixed(2)} Kz</Text>
          <Text>Multa: {Number(invoice.TotalMulta).toFixed(2)} Kz</Text>
          <Text>
            Total Retenção: {Number(invoice.total_retencao).toFixed(2)} Kz
          </Text>
          <Text>
            Total Incidência: {Number(invoice.total_incidencia).toFixed(2)} Kz
          </Text>
          <Text style={styles.totalText}>
            {invoice.estado === 0
              ? `Total a pagar: ${Number(invoice.TotalPreco).toFixed(2)} Kz`
              : invoice.estado === 1
                ? `Total pago: ${Number(invoice.TotalPreco).toFixed(2)} Kz`
                : `Valor: ${Number(invoice.TotalPreco).toFixed(2)} Kz`}
          </Text>
          <Text>({invoice.ValorAPagarExtenso})</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Por favor, dirija-se à secretaria para efetuar o pagamento.
          </Text>
        </View>

        <View style={styles.nonFiscalBox}>
          <Text style={styles.nonFiscalTitle}>Documento Não Fiscal</Text>
          <Text style={styles.nonFiscalText}>
            Este documento serve apenas como comprovativo informativo. Não
            possui validade fiscal para efeitos contabilísticos.
          </Text>
        </View>

        {/* ---------- Rodapé ---------- */}
        <Text style={styles.footer}>
          Documento emitido automaticamente — Universidade Metodista de Angola
          © {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}

export function PaymentReceipt2({
  invoice,
  academicYear,
}: {
  invoice: Invoice
  academicYear: string
}) {
  const document = (
    <PaymentReceiptDocument invoice={invoice} academicYear={academicYear} />
  )

  return (
    <div className="flex gap-3 pt-4">
      <PDFDownloadLink
        document={document}
        fileName={`Nota_de_pagamento_UMA_${invoice.Codigo}.pdf`}
      >
        {({ loading }) => (
          <Button
            className="flex-1"
            disabled={loading}
            aria-label={
              loading ? 'A gerar Nota...' : 'Descarregar Nota de pagamento'
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />A gerar
                recibo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Pagar Em Cash
              </>
            )}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  )
}

export default PaymentReceipt2
