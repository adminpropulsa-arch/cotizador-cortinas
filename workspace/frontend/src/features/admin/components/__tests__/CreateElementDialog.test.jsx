import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, it, vi } from "vitest"
import CreateElementDialog from "../CreateElementDialog"

it.each([
  ["lamas", "Lama", "Alto Útil (m)"], ["guias", "Guía", "Ancho Guía (m)"],
  ["cajones", "Cajón", "Alto Cajón/Vuelo (m)"], ["ejes", "Eje"],
  ["accesorios", "Accesorio"], ["motores", "Motor"], ["margins", "Margen"],
])("crea %s desde un diálogo con campos etiquetados", async (collection, title, dimension) => {
  const create = vi.fn().mockResolvedValue(undefined)
  const user = userEvent.setup()
  render(<CreateElementDialog collection={collection} items={[]} onCreate={create} />)
  expect(screen.queryByLabelText("Nombre")).not.toBeInTheDocument()
  await user.click(screen.getByRole("button", { name: `Agregar ${title}` }))
  expect(screen.getByRole("dialog", { name: `Crear ${title}` })).toBeInTheDocument()
  await user.type(screen.getByLabelText("Nombre"), "Nuevo elemento")
  if (collection !== "margins") await user.type(screen.getByLabelText("Código"), "TEST1")
  if (dimension) fireEvent.change(screen.getByLabelText(dimension), { target: { value: "0.125" } })
  if (collection === "margins") fireEvent.change(screen.getByLabelText("Porcentaje de recargo (%)"), { target: { value: "25" } })
  await user.click(screen.getByRole("button", { name: `Crear ${title}` }))
  await waitFor(() => expect(create).toHaveBeenCalledTimes(1))
  expect(create.mock.calls[0][0]).toMatchObject(collection === "margins" ? { id: "nuevo-elemento", percentage: 25 } : { code: "TEST1", price: 0 })
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
})

it("conserva el formulario ante error y evita sobrescribir códigos existentes", async () => {
  const create = vi.fn().mockRejectedValue(new Error("Sin permisos"))
  const user = userEvent.setup()
  render(<CreateElementDialog collection="ejes" items={[{ code: "E1" }]} onCreate={create} />)
  await user.click(screen.getByRole("button", { name: "Agregar Eje" }))
  await user.type(screen.getByLabelText("Código"), "E1")
  await user.type(screen.getByLabelText("Nombre"), "Eje de prueba")
  await user.click(screen.getByRole("button", { name: "Crear Eje" }))
  expect(await screen.findByRole("alert")).toHaveTextContent("Ya existe")
  expect(create).not.toHaveBeenCalled()
  await user.clear(screen.getByLabelText("Código"))
  await user.type(screen.getByLabelText("Código"), "E2")
  await user.click(screen.getByRole("button", { name: "Crear Eje" }))
  expect(await screen.findByRole("alert")).toHaveTextContent("Sin permisos")
  expect(screen.getByLabelText("Nombre")).toHaveValue("Eje de prueba")
  await user.click(screen.getByRole("button", { name: "Cancelar" }))
  await user.click(screen.getByRole("button", { name: "Agregar Eje" }))
  expect(screen.getByLabelText("Nombre")).toHaveValue("")
})
