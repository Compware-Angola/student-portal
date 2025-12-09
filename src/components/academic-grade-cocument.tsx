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

import { groupByAnoESemestre } from '@/utils/group-by-ano-seSemestre'
import { Button } from './ui/button'
import { FileText, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Disciplina } from '@/services/curriculum/get-curriculum-by-course.service'

const styles = StyleSheet.create({
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
  companyName: { fontSize: 15, fontWeight: 'bold', color: '#0d1b48' },
  companyDetails: { fontSize: 9, color: '#444', marginTop: 3 },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    padding: 40,
  },

  yearTitle: {
    backgroundColor: '#0d1b48',
    color: 'white',
    fontSize: 12,
    padding: 6,
    marginTop: 8,
  },

  semesterTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 6,
  },

  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },

  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
  },

  row: {
    flexDirection: 'row',
  },

  cellHeader: {
    padding: 5,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 10,
  },

  cell: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 10,
  },
})

type Props = {
  disciplinas: Disciplina[]
  curso: string
}

export function AcademicGradeDocument({ disciplinas, curso }: Props) {
  const data = groupByAnoESemestre(disciplinas)
  console.log({ data })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* ---------- HEADER DA UNIVERSIDADE (reaproveita o seu) ---------- */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo_uma.png" />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Universidade Metodista de Angola
            </Text>
            <Text style={styles.companyDetails}>
              Tel: +244 912 131 138 | Email: geral@uma.co.ao
            </Text>
          </View>
        </View>

        <Text style={styles.title}>GRADE CURRICULAR DO {curso}</Text>

        {/* ---------- CORPO ---------- */}

        {Object.entries(data).map(([ano, semestres]) => (
          <View key={ano}>
            {/* Ano */}
            <Text style={styles.yearTitle}>{ano}</Text>

            {Object.entries(semestres).map(([semestre, materias]) => (
              <View key={semestre}>
                {/* Semestre */}
                <Text style={styles.semesterTitle}>{semestre}</Text>

                {/* Tabela */}
                <View style={styles.table}>
                  {/* Cabeçalho */}
                  <View style={styles.rowHeader}>
                    <Text style={[styles.cellHeader, { width: '80%' }]}>
                      Disciplina
                    </Text>

                    <Text style={[styles.cellHeader, { width: '20%' }]}>
                      Duração
                    </Text>
                  </View>

                  {/* Linhas */}
                  {materias.map((disciplina, i) => (
                    <View key={i} style={styles.row}>
                      <Text style={[styles.cell, { width: '80%' }]}>
                        {disciplina.disciplina}
                      </Text>

                      <Text style={[styles.cell, { width: '20%' }]}>
                        {disciplina.duracaoDisciplina}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export function GradeCurricularPDF({
  disciplinas,
  curso,
}: {
  disciplinas: Disciplina[]
  curso: string
  disabled?: boolean
}) {
  const document = useMemo(
    () => <AcademicGradeDocument disciplinas={disciplinas} curso={curso} />,
    [disciplinas, curso],
  )

  return (
    <PDFDownloadLink
      document={document}
      fileName={`${curso.toLocaleLowerCase()}_grade_curricular_uma.pdf`}
    >
      {({ loading }) => (
        <Button disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />A gerar PDF...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Baixar Grade Curricular
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

export function usePDFBlob(disciplinas: Disciplina[], curso: string) {
  const [blob, setBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const doc = (
      <AcademicGradeDocument disciplinas={disciplinas} curso={curso} />
    )

    pdf(doc)
      .toBlob()
      .then((b) => {
        if (!cancelled) {
          setBlob(b)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [disciplinas, curso])

  return { blob, loading }
}
