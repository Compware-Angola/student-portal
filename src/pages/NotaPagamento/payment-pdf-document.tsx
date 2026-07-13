import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { PaymentDetail } from '@/services/payment/fetch-payment-details.service'
import type { StudentPayment } from '@/services/payment/fetch-student-payments.service'
import type { ProfileData } from '@/types/profile'

const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 60,
    paddingHorizontal: 45,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0D1B48',
  },
  logo: { width: 100, height: 52 },
  headerRight: { alignItems: 'flex-end' },
  orgName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B48',
    textAlign: 'right',
  },
  orgDetail: { fontSize: 8.5, color: '#333', marginTop: 2, textAlign: 'right' },
  orgDecree: { fontSize: 8, color: '#555', marginTop: 2, textAlign: 'right' },

  docTitleBlock: { alignItems: 'center', marginBottom: 18 },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B48',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  docSubtitle: { fontSize: 11, color: '#444', marginTop: 3 },

  studentBox: {
    backgroundColor: '#f4f6fb',
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
  },
  studentBoxTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B48',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  studentGrid: { flexDirection: 'row', gap: 20 },
  metaLabel: { fontSize: 9, color: '#666', marginBottom: 2 },
  metaValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111' },

  metaRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  metaItem: { flexDirection: 'column' },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#b0b8c9',
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#0D1B48',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#d0d7e3',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#d0d7e3',
    backgroundColor: '#f4f6fb',
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#2a3a6a',
  },
  tableCell: {
    padding: 6,
    fontSize: 9.5,
    color: '#222',
    borderRightWidth: 1,
    borderRightColor: '#d0d7e3',
  },
  tableCellLast: { padding: 6, fontSize: 9.5, color: '#222' },
  tableTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#e8ecf5',
    borderTopWidth: 1.5,
    borderTopColor: '#0D1B48',
  },
  tableTotalLabel: {
    padding: 6,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B48',
  },
  tableTotalValue: {
    padding: 6,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0D1B48',
    textAlign: 'right',
  },

  nonFiscalBox: {
    marginBottom: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#b71c1c',
    borderRadius: 4,
    backgroundColor: '#fdf3f4',
  },
  nonFiscalTitle: {
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#b71c1c',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  nonFiscalText: {
    fontSize: 9,
    textAlign: 'center',
    color: '#a33',
    lineHeight: 1.5,
  },

  pageFooter: {
    position: 'absolute',
    bottom: 24,
    left: 45,
    right: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#aaa',
    paddingTop: 5,
  },
  footerText: { fontSize: 8, color: '#888' },
})

const COL_SERVICE = '35%'
const COL_REF = '20%'
const COL_QTY = '10%'
const COL_MULTA = '15%'
const COL_SUBTOTAL = '20%'

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
  const emittedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── CABEÇALHO ── */}
        <View style={S.header}>
          <Image style={S.logo} src="/logo_uma.png" />
          <View style={S.headerRight}>
            <Text style={S.orgName}>Universidade Metodista de Angola</Text>
            <Text style={S.orgDecree}>
              (Aprovado pelo Decreto nº 30/07 de 07/05)
            </Text>
            <Text style={S.orgDetail}>
              Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi, Luanda
            </Text>
            <Text style={S.orgDetail}>
              Telefone: +244 912131138 / +244 947716133 / +244 942364667
            </Text>
            <Text style={S.orgDetail}>
              NIF: 5401150865 | Email: geral@uma.co.ao
            </Text>
          </View>
        </View>

        {/* ── TÍTULO ── */}
        <View style={S.docTitleBlock}>
          <Text style={S.docTitle}>Recibo de Pagamento</Text>
          <Text style={S.docSubtitle}>Ano Lectivo 2025–2026</Text>
        </View>

        {/* ── DADOS DO ESTUDANTE ── */}
        <View style={S.studentBox}>
          <Text style={S.studentBoxTitle}>Dados do Estudante</Text>
          <View style={S.studentGrid}>
            <View>
              <Text style={S.metaLabel}>Nome</Text>
              <Text style={S.metaValue}>{student.fullName}</Text>
            </View>
            <View>
              <Text style={S.metaLabel}>Matrícula</Text>
              <Text style={S.metaValue}>
                {student.enrollmentCode ?? student.preEnrollmentCode}
              </Text>
            </View>
          </View>
        </View>

        {/* ── METADADOS ── */}
        <View style={S.metaRow}>
          <View style={S.metaItem}>
            <Text style={S.metaLabel}>Código</Text>
            <Text style={S.metaValue}>{studentPayment.CodigoFactura}</Text>
          </View>
          <View style={S.metaItem}>
            <Text style={S.metaLabel}>Data de Emissão</Text>
            <Text style={S.metaValue}>
              {new Date(studentPayment.DATAFACTURA).toLocaleDateString('pt-AO')}
            </Text>
          </View>
        </View>

        {/* ── TABELA ── */}
        <View style={S.tableContainer}>
          <View style={S.tableHeaderRow}>
            <Text style={[S.tableHeaderCell, { width: COL_SERVICE }]}>
              Serviço
            </Text>
            <Text
              style={[
                S.tableHeaderCell,
                { width: COL_REF, textAlign: 'center' },
              ]}
            >
              Referência
            </Text>
            <Text
              style={[
                S.tableHeaderCell,
                { width: COL_QTY, textAlign: 'center' },
              ]}
            >
              Qtd
            </Text>
            <Text
              style={[
                S.tableHeaderCell,
                { width: COL_MULTA, textAlign: 'right' },
              ]}
            >
              Multa
            </Text>
            <Text
              style={[
                S.tableHeaderCell,
                {
                  width: COL_SUBTOTAL,
                  textAlign: 'right',
                  borderRightWidth: 0,
                },
              ]}
            >
              Subtotal
            </Text>
          </View>

          {details.map((item, i) => {
            const RowStyle = i % 2 === 0 ? S.tableRow : S.tableRowAlt
            return (
              <View key={i} style={RowStyle}>
                <Text style={[S.tableCell, { width: COL_SERVICE }]}>
                  {item.SERVICO}
                </Text>
                <Text
                  style={[S.tableCell, { width: COL_REF, textAlign: 'center' }]}
                >
                  {item.REFERENCIA}
                </Text>
                <Text
                  style={[S.tableCell, { width: COL_QTY, textAlign: 'center' }]}
                >
                  {item.QUANTIDADE}
                </Text>
                <Text
                  style={[
                    S.tableCell,
                    { width: COL_MULTA, textAlign: 'right' },
                  ]}
                >
                  {item.MULTA.toLocaleString('pt-AO')} Kz
                </Text>
                <Text
                  style={[
                    S.tableCellLast,
                    { width: COL_SUBTOTAL, textAlign: 'right' },
                  ]}
                >
                  {item.TOTAL.toLocaleString('pt-AO')} Kz
                </Text>
              </View>
            )
          })}

          <View style={S.tableTotalRow}>
            <Text style={[S.tableTotalLabel, { width: '80%' }]}>
              Total Geral
            </Text>
            <Text style={[S.tableTotalValue, { width: COL_SUBTOTAL }]}>
              {totalGeral.toLocaleString('pt-AO')} Kz
            </Text>
          </View>
        </View>

        {/* ── NÃO FISCAL ── */}
        <View style={S.nonFiscalBox}>
          <Text style={S.nonFiscalTitle}>Documento Não Fiscal</Text>
          <Text style={S.nonFiscalText}>
            Este documento serve apenas como comprovativo informativo. Não
            possui validade fiscal para efeitos contabilísticos.
          </Text>
        </View>

        {/* ── RODAPÉ ── */}
        <View style={S.pageFooter} fixed>
          <Text style={S.footerText}>
            Recibo nº {studentPayment.CodigoFactura}
          </Text>
          <Text style={S.footerText}>Emitido em {emittedAt}</Text>
          <Text style={S.footerText}>
            Documento emitido automaticamente — UMA ©{' '}
            {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
