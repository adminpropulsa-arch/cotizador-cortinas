import { expect, it } from "vitest"
import getPdfItemLines from "../getPdfItemLines"

const item = { width: 1.5, height: 2, qty: 3, selectedLama: { name: "Aluminio" }, calcs: { total: 100, slatsCost: 80, motorCost: 20 } }

it("mantiene el mismo total en ambas variantes sin exponer costos al cliente", () => {
  const internal = getPdfItemLines(item, 1.5, "internal")
  const client = getPdfItemLines(item, 1.5, "client")
  expect(internal.total).toBe(450)
  expect(client.total).toBe(450)
  expect(internal.lines.join(" ")).toContain("Costo base unitario: $100.00")
  expect(internal.lines.join(" ")).toContain("Recargo: 50.00%")
  expect(client.lines.join(" ")).not.toMatch(/costo|recargo|tarifa/i)
  expect(client.lines.join(" ")).toContain("Precio unitario: $150.00")
})
