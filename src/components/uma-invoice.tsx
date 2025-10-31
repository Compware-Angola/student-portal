import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import type { Invoice } from '@/services/invoice/get-invoices-by-matricula.service'
import { DownloadIcon } from 'lucide-react'


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
  academicYear,
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
            {/*<Text style={styles.companyDetails}>NIF: 5410000000</Text>
          <Text style={styles.companyDetails}>Rua da Paz, Luanda - Angola</Text>
          <Text style={styles.companyDetails}>Tel: +244 900 000 000</Text>
          <Text style={styles.companyDetails}>Email: info@uma.co.ao</Text>*/}
          </View>
        </View>

        {/* ---------- Título ---------- */}
        <Text style={styles.title}>Recibo de Pagamento</Text>

        {/* ---------- Informações principais ---------- */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Codigo:</Text> {invoice.Codigo}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Data Emissão:</Text>{' '}
              {new Date(invoice.DataFactura).toLocaleDateString()}
            </Text>
            {
              <>
                {invoice.dataVencimento && (
                  <Text>
                    <Text style={styles.label}>Vencimento:</Text>{' '}
                    {new Date(invoice.dataVencimento).toLocaleDateString()}
                  </Text>
                )}
              </>
            }
          </View>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Ano Lectivo:</Text> {academicYear}
            </Text>
            <Text>
              <Text style={styles.label}>Polo:</Text>{' '}
              {invoice.poloId === '1' ? 'Sede Luanda' : invoice.poloId}
            </Text>
          </View>
        </View>

        {/* ---------- Dados do Estudante ---------- */}
        <View style={styles.section}>
          <Text style={styles.label}>Dados do Estudante</Text>
          <Text>Matrícula: {invoice.CodigoMatricula}</Text>
        </View>

        {/* ---------- Dados de Pagamento ---------- */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>DADOS PARA PAGAMENTO</Text>
          <View style={styles.paymentInfo}>
            <Text>Entidade: 10065</Text>
            <Text>Referência: {invoice.Referencia}</Text>
          </View>
        </View>

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

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '60%' }]}>
              {invoice.Descricao}
            </Text>
            <Text
              style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
            >
              {invoice.TotalPreco.toFixed(2)}
            </Text>
            <Text
              style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
            >
              {invoice.totalIVA.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ---------- Totais ---------- */}
        <View style={styles.totalSection}>
          <Text>Desconto: {invoice.Desconto.toFixed(2)} Kz</Text>
          <Text>Multa: {invoice.TotalMulta.toFixed(2)} Kz</Text>
          <Text>Total Retenção: {invoice.totalRetencao.toFixed(2)} Kz</Text>
          <Text>Total Incidência: {invoice.totalIncidencia.toFixed(2)} Kz</Text>
          <Text style={styles.totalText}>
            Total a Pagar: {invoice.TotalPreco.toFixed(2)} Kz
          </Text>
          <Text>({invoice.ValorAPagarExtenso})</Text>
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

export function PaymentReceipt({
  invoice,
  academicYear,
}: {
  invoice: Invoice
  academicYear: string
}) {
  return (
    <PDFDownloadLink
      document={
        <PaymentReceiptDocument invoice={invoice} academicYear={academicYear} />
      }
      fileName={`Recibo_de_pagamento_UMA_${invoice.Codigo}.pdf`}
    >
      {({ loading }) => (
        <Button
          aria-label="Download Invoice"
          variant="outline"
          size="icon"
          disabled={loading}
        >
          <DownloadIcon />
        </Button>
      )}
    </PDFDownloadLink>
  )
}
