const text = (key, label) => ({ key, label, type: "text" })
const number = (key, label, step = "0.01", min = "0") => ({ key, label, type: "number", step, min })
const base = [text("code", "Código"), text("name", "Nombre")]
const price = number("price", "Precio (USD)")

export const CREATE_SCHEMAS = {
  accesorios: { title: "Accesorio", defaults: { code: "", name: "", price: 0 }, fields: [...base, price] },
  cajones: { title: "Cajón", defaults: { code: "", name: "", unit: "UN", heightAdjustment: 0.18, price: 0 }, fields: [...base, number("heightAdjustment", "Alto Cajón/Vuelo (m)", "0.001", "0.001"), price] },
  ejes: { title: "Eje", defaults: { code: "", name: "", unit: "UN", price: 0 }, fields: [...base, price] },
  guias: { title: "Guía", defaults: { code: "", name: "", unit: "UN", profileWidth: 0.05, price: 0 }, fields: [...base, number("profileWidth", "Ancho Guía (m)", "0.001", "0.001"), price] },
  lamas: { title: "Lama", defaults: { code: "", name: "", unit: "MTS", usefulHeight: 0.05, price: 0, requiredGasketCode: "" }, fields: [...base, number("usefulHeight", "Alto Útil (m)", "0.001", "0.001"), price] },
  margins: { title: "Margen", defaults: { name: "", percentage: 0 }, fields: [text("name", "Nombre"), number("percentage", "Porcentaje de recargo (%)")] },
  motores: { title: "Motor", defaults: { code: "", name: "", price: 0, compatibleAcc: [] }, fields: [...base, price] },
}

export function prepareNewElement(collection, draft, items) {
  const item = { ...draft, name: draft.name.trim() }
  if (collection === "margins") item.id = item.name.toLowerCase().replace(/\s+/g, "-")
  else item.code = item.code.trim()
  const id = item.code || item.id
  if (!item.name || !id) throw new Error("Completá el código y el nombre.")
  if (id.includes("/")) throw new Error("El identificador no puede contener /.")
  if (items.some((existing) => (existing.code || existing.id) === id)) throw new Error("Ya existe un elemento con ese identificador.")
  for (const field of CREATE_SCHEMAS[collection].fields.filter((field) => field.type === "number")) {
    if (item[field.key] === "" || !Number.isFinite(Number(item[field.key])) || Number(item[field.key]) < Number(field.min)) throw new Error(`Revisá el campo ${field.label}.`)
    item[field.key] = Number(item[field.key])
  }
  return item
}
