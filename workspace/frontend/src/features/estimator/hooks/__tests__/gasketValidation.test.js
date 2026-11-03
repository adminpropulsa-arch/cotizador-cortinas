import { expect, it } from "vitest"
import { getLamaAccessories, hasMissingGasket } from "../initialCurtain"

const lama = { requiredGasketCode: "BUR1" }
const gasket = { code: "BUR1", name: "Burlete" }

it("no agrega automáticamente burletes incompatibles y bloquea el presupuesto", () => {
  const item = { selectedLama: lama, selectedMotor: { compatibleAcc: [] }, selectedAccs: [] }
  expect(getLamaAccessories(item, lama, [gasket])).toEqual([])
  expect(hasMissingGasket({ ...item, selectedAccs: [gasket] })).toBe(true)
})

it("agrega una sola vez el burlete compatible y habilita el presupuesto", () => {
  const item = { selectedLama: lama, selectedMotor: { compatibleAcc: ["BUR1"] }, selectedAccs: [gasket] }
  expect(getLamaAccessories(item, lama, [gasket])).toEqual([gasket])
  expect(hasMissingGasket(item)).toBe(false)
})
