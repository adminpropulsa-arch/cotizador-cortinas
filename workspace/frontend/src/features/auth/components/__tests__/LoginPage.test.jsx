import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, expect, it, vi } from "vitest"
import LoginPage from "../LoginPage"

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
}))

vi.mock("@/shared/providers/AuthContext", () => ({
  useAuth: () => ({ ...authMocks, authError: null }),
}))

function renderLoginPage() {
  return render(<LoginPage onAuthenticated={vi.fn()} />)
}

beforeEach(() => {
  vi.clearAllMocks()
  authMocks.login.mockResolvedValue({})
})

it("muestra únicamente el formulario de inicio de sesión y el mensaje de contacto con Grupo Gonzalez", () => {
  renderLoginPage()

  expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument()
  expect(screen.getByLabelText("Correo electrónico")).toBeRequired()
  expect(screen.getByLabelText("Contraseña")).toBeRequired()
  expect(screen.getByRole("button", { name: "Iniciar Sesión" })).toBeInTheDocument()
  expect(screen.queryByRole("button", { name: /crear una cuenta|crear cuenta|registr/i })).not.toBeInTheDocument()
  expect(screen.getByText(/comunicate con/i)).toBeInTheDocument()
  expect(screen.getByText(/Grupo Gonzalez/i)).toBeInTheDocument()
})

it("no envía credenciales cuando faltan campos obligatorios", async () => {
  const user = userEvent.setup()
  renderLoginPage()

  await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }))

  expect(authMocks.login).not.toHaveBeenCalled()
})

it("traduce errores de credenciales de Firebase", async () => {
  const user = userEvent.setup()
  authMocks.login.mockRejectedValueOnce({ code: "auth/invalid-credential" })
  renderLoginPage()

  await user.type(screen.getByLabelText("Correo electrónico"), "usuario@empresa.com")
  await user.type(screen.getByLabelText("Contraseña"), "incorrecta")
  await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }))

  expect(await screen.findByRole("alert")).toHaveTextContent("El correo o la contraseña no son correctos.")
})

it("no ofrece acceso demo ni rellena credenciales", () => {
  renderLoginPage()
  expect(screen.queryByRole("button", { name: /demo|relleno/i })).not.toBeInTheDocument()
  expect(screen.getByLabelText("Correo electrónico")).toHaveValue("")
  expect(screen.getByLabelText("Contraseña")).toHaveValue("")
})

it("inicia el splash después de una autenticación exitosa", async () => {
  const user = userEvent.setup()
  const onAuthenticated = vi.fn()

  render(<LoginPage onAuthenticated={onAuthenticated} />)
  await user.type(screen.getByLabelText("Correo electrónico"), "usuario@empresa.com")
  await user.type(screen.getByLabelText("Contraseña"), "Pass1234")
  await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }))

  await waitFor(() => expect(onAuthenticated).toHaveBeenCalledTimes(1))
  expect(authMocks.login).toHaveBeenCalledWith("usuario@empresa.com", "Pass1234")
})
