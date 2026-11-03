import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import EstimatorOptions from "../EstimatorOptions"

const accesorios = [{ code: "BUR1", name: "Burlete", price: 2 }, { code: "ACC1", name: "Control", price: 10 }]
const motores = [
  { code: "M1", name: "Motor 1", compatibleAcc: ["BUR1", "ACC1"] },
  { code: "M2", name: "Motor 2", compatibleAcc: ["ACC1"] },
]

function Options() {
  const [motor, setMotor] = useState(motores[0])
  const [selected, setSelected] = useState(accesorios)
  return <EstimatorOptions hasVuelo={false} setHasVuelo={vi.fn()} setAddVueloMeasure={vi.fn()}
    cajones={[]} ejes={[]} motores={motores} selectedMotor={motor} setSelectedMotor={setMotor}
    accesorios={accesorios} selectedAccs={selected} setSelectedAccs={setSelected}
    selectedLama={{ requiredGasketCode: "BUR1" }} />
}

it("descarta accesorios incompatibles al cambiar motor y vuelve a exigir burlete", () => {
  render(<Options />)
  expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText("Motorización"), { target: { value: "M2" } })
  expect(screen.getByRole("alert")).toHaveTextContent("requiere obligatoriamente")
  expect(screen.queryByRole("button", { name: "Quitar Burlete" })).not.toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Quitar Control" })).toBeInTheDocument()
  fireEvent.click(screen.getByText("Seleccionar accesorios (1)"))
  expect(screen.getByRole("checkbox", { name: /Burlete/ })).toBeDisabled()
})
