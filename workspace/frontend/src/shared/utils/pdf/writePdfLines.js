export default function writePdfLines(doc, lines, startY) {
  let y = startY
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, 175)
    for (const text of wrapped) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      doc.text(text, 17, y)
      y += 5
    }
  }
  return y
}
