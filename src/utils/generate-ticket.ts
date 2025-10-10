import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

interface TicketProps {
  entity?: string
  codigoCedente?: string
  reference?: string
  value?: string
  code?: string
  cpfCnpj?: string
  vencimento?: string
  dataDocumento?: string
  dataProcessamento?: string
  discount?: string
  payer?: string
  shift?: string
  course?: string
  enderecoPagador?: string
  cpfPagador?: string
  codigoBarras?: string
  instruction?: string
}

const createBoletoHTML = (data: TicketProps): string => {
  return `
    <div style="background: #ffffff; color: #000000; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); max-width: 56rem; width: 100%;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #d9d9d9; padding: 1rem; display: flex; align-items: flex-start; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <img src="/logo_bg.png" alt="UMA Logo" style="width: 3rem; height: 3rem;" />
            <span style="font-weight: 700; font-size: 0.875rem; color: #000000;">UMA</span>
          </div>
          <div style="font-size: 1.25rem; font-weight: 700; border-left: 2px solid #d9d9d9; border-right: 2px solid #d9d9d9; padding: 0 0.75rem; color: #000000;">
            364-6
          </div>
          <div style="font-size: 0.875rem; font-family: monospace; letter-spacing: 0.05em; color: #000000;">
            TALÃO DE PAGAMENTO
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0;">
          <div style="width: 3rem; height: 0.5rem; background: #ff6200;"></div>
          <div style="width: 3rem; height: 0.5rem; background: #ff6200; margin-top: 0.25rem;"></div>
          <div style="width: 3rem; height: 0.5rem; background: #ff6200; margin-top: 0.25rem;"></div>
        </div>
      </div>

      <!-- Info Section -->
      <div style="padding: 1rem;">
        <div style="border: 1px solid #d9d9d9;">
          <!-- First Row -->
          <div style="display: grid; grid-template-columns: repeat(12, 1fr); border-bottom: 1px solid #d9d9d9;">
            <div style="grid-column: span 8; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Nome do Aluno</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">
                ${data.payer}
              </div>
            </div>
            <div style="grid-column: span 4; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Vencimento</div>
              <div style="font-size: 0.75rem; font-weight: 700; margin-top: 0.25rem; color: #000000;">${data.vencimento || ''}</div>
            </div>
          </div>

          <!-- Second Row -->
          <div style="display: grid; grid-template-columns: repeat(12, 1fr); border-bottom: 1px solid #d9d9d9;">
            <div style="grid-column: span 8; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Entidade</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.entity || ''}</div>
            </div>
            <div style="grid-column: span 4; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Referência</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.reference || ''}</div>
            </div>
          </div>

          <!-- Third Row -->
          <div style="display: grid; grid-template-columns: repeat(12, 1fr); border-bottom: 1px solid #d9d9d9;">
            <div style="grid-column: span 2; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Data do documento</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.dataDocumento || ''}</div>
            </div>
            <div style="grid-column: span 4; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Código</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.code || ''}</div>
            </div>
            <div style="grid-column: span 2; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Data processamento</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.dataProcessamento || ''}</div>
            </div>
            <div style="grid-column: span 3; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Valor:</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.value || ''}</div>
            </div>
          </div>

          <!-- Fourth Row -->
          <div style="display: grid; grid-template-columns: repeat(12, 1fr); border-bottom: 1px solid #d9d9d9;">
            <div style="grid-column: span 2; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Turma</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.shift}</div>
            </div>
            <div style="grid-column: span 4; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Curso</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">${data.course}</div>
            </div>

            <div style="grid-column: span 2; border-right: 1px solid #d9d9d9; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">Multa</div>
              <div style="font-size: 0.75rem; font-weight: 600; margin-top: 0.25rem; color: #000000;">-</div>
            </div>

            <div style="grid-column: span 4; padding: 0.5rem;">
              <div style="font-size: 9px; color: #666666;">(=) Desconto</div>
              <div style="font-size: 0.75rem; font-weight: 700; margin-top: 0.25rem; color: #000000;">${data.discount || ''}</div>
            </div>
          </div>

          <!-- Instructions and Charges Section -->
          <div style="display: grid; grid-template-columns: repeat(12, 1fr);">
            <div style="grid-column: span 12; border-right: 1px solid #d9d9d9;">
              <div style="padding: 0.5rem; border-bottom: 1px solid #d9d9d9;">
                <div style="font-size: 9px; color: #666666;">Instruções (Renovar a referência)</div>
              </div>
              <div style="padding: 0.5rem;">
                <div style="font-size: 10px; white-space: pre-line; color: #000000;">${data.instruction || ''}</div>
              </div>
            </div>
          </div>

          <!-- Payer Section -->
          <div style="border-top: 2px solid #d9d9d9; padding: 0.5rem;">
            <div style="font-size: 9px; color: #666666;">Instruções Pagamento</div>
            <div style="font-size: 10px; white-space: pre-line; color: #000000;">
             Efectue seu pagamento através do número de referência deste talão.
        </div>
      </div>

      <!-- Barcode Section -->
    </div>
  `
}

export const handleGeneratePDF = async (ticket: TicketProps) => {
  const htmlContent = createBoletoHTML(ticket)

  const tempElement = document.createElement('div')
  tempElement.innerHTML = htmlContent
  tempElement.style.position = 'absolute'
  tempElement.style.left = '-9999px'
  tempElement.style.width = '210mm'
  tempElement.style.background = '#ffffff'
  document.body.appendChild(tempElement)

  const canvas = await html2canvas(tempElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: 896, // 56rem * 16px
    windowHeight: tempElement.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png', 1.0)

  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const imgProps = pdf.getImageProperties(imgData)
  const pdfHeight = (imgProps.height * pageWidth) / imgProps.width

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight)
  pdf.save(`boleto.pdf`)

  document.body.removeChild(tempElement)
}
