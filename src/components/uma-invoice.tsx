
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
import type { Invoice } from '@/services/invoice/get-invoices-by-matricula.service'
import { Download, Printer } from 'lucide-react'

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
            Informações opcionais da empresa
            <Text style={styles.companyDetails}></Text>
            <Text style={styles.companyDetails}>Nome: MUTUE- SOLUÇOES TECNOLOGIA INTELIGENTES, LDA</Text>
            <Text style={styles.companyDetails}>NIF: 5000977381</Text>
            <Text style={styles.companyDetails}>Cidade: Luanda - Angola</Text>
            <Text style={styles.companyDetails}>Tel: +244 922969192 </Text>
            <Text style={styles.companyDetails}>Email: geral@mutue.net</Text>
            <Text style={styles.companyDetails}>Web-site: www.mutue.net</Text>
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

            {invoice.dataVencimento && (
              <Text>
                <Text style={styles.label}>Vencimento:</Text>{' '}
                {new Date(invoice.dataVencimento).toLocaleDateString()}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Ano Lectivo:</Text> {academicYear}
            </Text>
            <Text>
              <Text style={styles.label}>Polo:</Text>{' '}
              {invoice.polo_id === '1' ? 'Sede Luanda' : invoice.polo_id}
            </Text>
          </View>
        </View>

        {/* ---------- Dados do Estudante ---------- */}
        <View style={styles.section}>
          <Text style={styles.label}>Dados do Estudante</Text>
          <Text>Nome: {invoice.NomeCompletoAluno}</Text>
          <Text>Matrícula: {invoice.CodigoMatricula}</Text>
        </View>

        {/* ---------- Dados de Pagamento ---------- */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>DADOS PARA PAGAMENTO</Text>
          <View style={styles.paymentInfo}>
            <Text>Entidade: {invoice.referencias_pagamento[0]?.ENTITY_ID || '10065'}</Text>
            <Text>Referência: {invoice.referencias_pagamento[0]?.REFERENCE || invoice.Referencia}</Text>
          </View>
        </View>

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
            Total Pago: {Number(invoice.TotalPreco).toFixed(2)} Kz
          </Text>
          <Text>({invoice.ValorAPagarExtenso})</Text>
        </View>

        {/* ---------- Rodapé ---------- */}
        <Text style={styles.footer}>
          Documento emitido automaticamente — Universidade Metodista de Angola ©{' '}
          {new Date().getFullYear()}
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
  const document = (
    <PaymentReceiptDocument invoice={invoice} academicYear={academicYear} />
  )

  // Função para imprimir: gera um blob do PDF e abre em nova aba para imprimir
  const handlePrint = async () => {
    try {
      const blob = await pdf(document).toBlob()
      const fileURL = URL.createObjectURL(blob)
      const printWindow = window.open(fileURL)
      // aguarda janela abrir, depois aciona print
      if (printWindow) {
        // Algumas browsers bloqueiam print automático; chamamos quando possível
        printWindow.focus()
        printWindow.print()
      } else {
        // fallback: abrir o arquivo diretamente (usuário poderá imprimir manualmente)
        window.open(fileURL, '_blank')
      }
    } catch (error) {
      console.error('Erro ao gerar/abrir PDF para impressão', error)
      // opcional: notificar usuário via toast
    }
  }

  return (
    <div className="flex gap-3 pt-4">
      {/* Botão para descarregar o PDF — ocupa o espaço (flex-1) */}
      <PDFDownloadLink
        document={document}
        fileName={`Recibo_de_pagamento_UMA_${invoice.Codigo}.pdf`}
      >
        {({ loading }) => (
          <Button className="flex-1" disabled={loading} aria-label="Descarregar PDF">
            <Download className="mr-2 h-4 w-4" />
            Descarregar PDF
          </Button>
        )}
      </PDFDownloadLink>

      {/* Botão para imprimir — apenas ícone, variante outline */}
      <Button variant="outline" onClick={handlePrint} aria-label="Imprimir">
        <Printer className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default PaymentReceipt
