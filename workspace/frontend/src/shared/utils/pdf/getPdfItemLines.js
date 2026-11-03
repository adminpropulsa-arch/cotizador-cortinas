const money = (value) => `$${Number(value || 0).toFixed(2)} USD`
const COMPONENTS = [
  ["slatsCost", "Lama/Tablilla", "selectedLama"],
  ["guidesCost", "Guías Laterales", "selectedGuide"],
  ["cajonCost", "Cajón (Vuelo)", "selectedCajon"],
  ["ejeCost", "Eje/Tubo", "selectedEje"],
  ["motorCost", "Motorización", "selectedMotor"],
  ["accsCost", "Accesorios", "selectedAccs"],
]

export default function getPdfItemLines(item, marginFactor, audience) {
  const calcs = item.calcs || {}
  const details = item.details || item
  const base = calcs.total ?? COMPONENTS.reduce((sum, [key]) => sum + (calcs[key] || 0), 0)
  const unitPrice = base * marginFactor
  const lines = [`Medidas: ${item.width} m x ${item.height} m`]
  for (const [key, label, selectedKey] of COMPONENTS) {
    const selected = details[selectedKey] || item[selectedKey]
    if (key !== "slatsCost" && !(calcs[key] > 0)) continue
    const name = Array.isArray(selected) ? selected.map((acc) => acc.name).join(", ") : selected?.name
    lines.push(`${label}: ${name || "N/A"}${audience === "internal" ? ` | Costo base: ${money(calcs[key])}` : ""}`)
  }
  if (audience === "internal") lines.push(
    `Medidas finales: ${Number(calcs.wFinal || item.width).toFixed(2)} m x ${Number(calcs.hFinal || item.height).toFixed(2)} m`,
    `Costo base unitario: ${money(base)} | Recargo: ${((marginFactor - 1) * 100).toFixed(2)}%`,
  )
  lines.push(`Precio unitario: ${money(unitPrice)} | Subtotal (${item.qty} un): ${money(unitPrice * item.qty)}`)
  return { lines, total: unitPrice * item.qty }
}
