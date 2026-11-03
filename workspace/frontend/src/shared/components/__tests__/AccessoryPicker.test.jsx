import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import AccessoryPicker from "../AccessoryPicker"

const accesorios = [
  { code: "ACC1", name: "Control remoto", category: "Mandos", price: 10 },
  { code: "ACC2", name: "Pulsador", category: "Mandos", price: 8 },
  { code: "BUR1", name: "Burlete", category: "Sellado", price: 2 },
]

function Picker() {
  const [codes, setCodes] = useState([])
  return <AccessoryPicker accesorios={accesorios} selectedCodes={codes} onChange={setCodes} compatibleCodes={["ACC1", "BUR1"]} />
}

it("busca por nombre, código y categoría y permite quitar la selección", () => {
  render(<Picker />)
  fireEvent.click(screen.getByText(/Seleccionar accesorios/))
  const search = screen.getByLabelText("Buscar accesorios")
  fireEvent.change(search, { target: { value: "Mandos" } })
  expect(screen.queryByRole("checkbox", { name: /Burlete/ })).not.toBeInTheDocument()
  expect(screen.getByRole("checkbox", { name: /Pulsador/ })).toBeDisabled()
  fireEvent.click(screen.getByRole("checkbox", { name: /Control remoto/ }))
  expect(screen.getByText("Seleccionar accesorios (1)")).toBeInTheDocument()
  fireEvent.change(search, { target: { value: "BUR1" } })
  fireEvent.click(screen.getByRole("checkbox", { name: /Burlete/ }))
  expect(screen.getByText("Seleccionar accesorios (2)")).toBeInTheDocument()
  fireEvent.click(screen.getByRole("button", { name: "Quitar Control remoto" }))
  expect(screen.getByText("Seleccionar accesorios (1)")).toBeInTheDocument()
  fireEvent.change(search, { target: { value: "inexistente" } })
  expect(screen.getByText("No se encontraron accesorios.")).toBeInTheDocument()
})
