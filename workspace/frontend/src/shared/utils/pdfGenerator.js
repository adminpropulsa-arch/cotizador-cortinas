import { jsPDF } from "jspdf"
import drawPdfShutterDiagram from "./drawPdfShutterDiagram"
import drawBudgetPdfHeader from "./pdf/drawBudgetPdfHeader"
import getPdfItemLines from "./pdf/getPdfItemLines"
import writePdfLines from "./pdf/writePdfLines"

export function generatePDF({ client = "", items = [], marginName, marginFactor = 1 }, audience = "internal") {
  if (!["internal", "client"].includes(audience)) throw new Error("Tipo de PDF inválido")
  const doc = new jsPDF()
  let y = drawBudgetPdfHeader(doc, client, marginName, audience)
  let total = 0
  items.forEach((item, index) => {
    const heading = `${item.name || `Cortina ${index + 1}`} - Cantidad: ${item.qty} un`
    const details = getPdfItemLines(item, marginFactor, audience)
    const neededHeight = 50 + [heading, ...details.lines].reduce((count, line) => count + doc.splitTextToSize(line, 175).length, 0) * 5
    if (y + neededHeight > 275) {
      doc.addPage()
      y = 20
    }
    doc.setFont("helvetica", "bold")
    y = writePdfLines(doc, [heading], y)
    drawPdfShutterDiagram(doc, item, 160, y + 3)
    y += 42
    doc.setFont("helvetica", "normal")
    y = writePdfLines(doc, details.lines, y) + 8
    total += details.total
  })
  doc.setFont("helvetica", "bold")
  writePdfLines(doc, [`TOTAL PRESUPUESTO: $${total.toFixed(2)} USD`], y + 5)
  const reference = (client.trim() || "Sin_referencia").replace(/[^\p{L}\p{N}_-]+/gu, "_")
  doc.save(`Presupuesto_${reference}_${audience === "internal" ? "Interno" : "Cliente"}.pdf`)
}
