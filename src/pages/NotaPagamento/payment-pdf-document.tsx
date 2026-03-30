import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import type { PaymentDetail } from '@/services/payment/fetch-payment-details.service'
import type { StudentPayment } from '@/services/payment/fetch-student-payments.service'
import type { ProfileData } from '@/types/profile'

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
    color: '#0D1B48',
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
    borderColor: '#0D1B48',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f8f9fb',
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0D1B48',
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
    backgroundColor: '#0D1B48',
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
  totalText: { fontSize: 12, fontWeight: 'bold', color: '#0D1B48' },
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

export function DetailedInvoiceStyledPDF({
  student,
  studentPayment,
  details,
}: {
  student: ProfileData
  studentPayment: StudentPayment
  details: PaymentDetail[]
}) {
  const totalGeral = details.reduce((acc, item) => acc + item.TOTAL, 0)
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
        <Text style={styles.title}>Recibo de Pagamento</Text>

        {/* ---------- Informações principais ---------- */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Codigo:</Text>{' '}
              {studentPayment.CodigoFactura}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Data Emissão:</Text>{' '}
              {new Date(studentPayment.DATAFACTURA).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Ano Lectivo:</Text> {2025 + '-' + 2026}
            </Text>
          </View>
        </View>

        {/* ---------- Dados do Estudante ---------- */}
        <View style={styles.section}>
          <Text style={styles.label}>Dados do Estudante</Text>
          <Text>Nome: {student.fullName}</Text>
          <Text>
            Matrícula: {student.enrollmentCode ?? student.preEnrollmentCode}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, { width: '35%' }]}>
              Serviço
            </Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>
              Referência
            </Text>
            <Text style={[styles.tableCellHeader, { width: '10%' }]}>Qtd</Text>
            <Text style={[styles.tableCellHeader, { width: '15%' }]}>
              Multa
            </Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>
              Subtotal
            </Text>
          </View>

          {details.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '35%' }]}>
                {item.SERVICO}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '20%', textAlign: 'center' },
                ]}
              >
                {item.REFERENCIA}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '10%', textAlign: 'center' },
                ]}
              >
                {item.QUANTIDADE}
              </Text>
              <Text
                style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}
              >
                {item.MULTA.toLocaleString('pt-AO')} Kz
              </Text>
              <Text
                style={[styles.tableCell, { width: '20%', textAlign: 'right' }]}
              >
                {item.TOTAL.toLocaleString('pt-AO')} Kz
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            TOTAL GERAL: {totalGeral.toLocaleString('pt-AO')} Kz
          </Text>
        </View>

        <View style={styles.nonFiscalBox}>
          <Text style={styles.nonFiscalTitle}>Documento Não Fiscal</Text>
          <Text style={styles.nonFiscalText}>
            Este documento serve apenas como comprovativo informativo. Não
            possui validade fiscal para efeitos contabilísticos.
          </Text>
        </View>

        <Text style={styles.footer}>
          Documento emitido automaticamente — Universidade Metodista de Angola
          © {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}

// export function DetailedInvoiceStyledPDF({
//   invoice,
//   academicYear,
// }: {
//   invoice: Invoice
//   academicYear: string
// }) {
//   const document = (
//     <PaymentReceiptDocument invoice={invoice} academicYear={academicYear} />
//   )

//   return (
//     <div className="flex gap-3 pt-4">
//       <PDFDownloadLink
//         document={document}
//         fileName={`Nota_de_pagamento_UMA_${invoice.Codigo}.pdf`}
//       >
//         {({ loading }) => (
//           <Button
//             className="flex-1"
//             disabled={loading}
//             aria-label={
//               loading ? 'A gerar Nota...' : 'Descarregar Nota de pagamento'
//             }
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />A gerar
//                 recibo...
//               </>
//             ) : (
//               <>
//                 <FileText className="mr-2 h-4 w-4" />
//                 Pagar Em Cash
//               </>
//             )}
//           </Button>
//         )}
//       </PDFDownloadLink>
//     </div>
//   )
// }
