import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import PdfButtons from "../PdfButtons"

const generate = vi.hoisted(() => vi.fn())
vi.mock("@/shared/utils/pdfGenerator", () => ({ generatePDF: generate }))

it("envía el mismo presupuesto a las dos variantes de PDF", () => {
  const budget = { client: "Cliente", items: [], marginFactor: 1.25 }
  render(<PdfButtons budget={budget} />)
  fireEvent.click(screen.getByRole("button", { name: "PDF interno" }))
  fireEvent.click(screen.getByRole("button", { name: "PDF cliente" }))
  expect(generate).toHaveBeenNthCalledWith(1, budget, "internal")
  expect(generate).toHaveBeenNthCalledWith(2, budget, "client")
})
