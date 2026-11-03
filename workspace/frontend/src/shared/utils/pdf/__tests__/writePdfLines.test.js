import { expect, it, vi } from "vitest"
import writePdfLines from "../writePdfLines"

it("divide textos largos y crea páginas antes de salir del área imprimible", () => {
  const doc = { splitTextToSize: () => ["primera línea", "segunda línea"], text: vi.fn(), addPage: vi.fn() }
  expect(writePdfLines(doc, ["texto largo"], 275)).toBe(25)
  expect(doc.text).toHaveBeenNthCalledWith(1, "primera línea", 17, 275)
  expect(doc.addPage).toHaveBeenCalledTimes(1)
  expect(doc.text).toHaveBeenNthCalledWith(2, "segunda línea", 17, 20)
})
