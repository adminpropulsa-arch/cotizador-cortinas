export default function drawBudgetPdfHeader(doc, client, marginName, audience) {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(30, 41, 59)
  doc.text(audience === "internal" ? "PRESUPUESTO INTERNO" : "PRESUPUESTO PARA CLIENTE", 15, 22)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const reference = doc.splitTextToSize(`Cliente / Referencia: ${client || "Sin referencia"}`, 175)
  doc.text(reference, 15, 32)
  let y = 32 + reference.length * 5
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 15, y)
  y += 7
  if (audience === "internal") {
    doc.text(`Tarifa: ${marginName || "Base"}`, 15, y)
    y += 7
  }
  return y + 5
}
