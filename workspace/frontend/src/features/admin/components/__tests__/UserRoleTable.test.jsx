import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import UserRoleTable from "../UserRoleTable"

const mockUsers = [
  { id: "u1", uid: "u1", email: "master@empresa.com", displayName: "Master Principal", role: "master", blocked: false },
  { id: "u2", uid: "u2", email: "empleado@metalconf.com", displayName: "Empleado Juan", role: "empleado", blocked: false },
]

const userServiceMocks = vi.hoisted(() => ({
  authorizeUserEmail: vi.fn(),
  normalizeEmail: (email) => (typeof email === "string" ? email.trim().toLowerCase() : ""),
  setUserBlockedStatus: vi.fn(),
  subscribeToAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
  ROLES: { MASTER: "master", EMPLEADO: "empleado" },
}))

vi.mock("@/features/auth/services/userService", () => userServiceMocks)
vi.mock("@/shared/providers/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "u1", email: "master@empresa.com" } }),
}))

describe("UserRoleTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userServiceMocks.subscribeToAllUsers.mockImplementation((callback) => {
      callback(mockUsers)
      return vi.fn()
    })
    userServiceMocks.updateUserRole.mockResolvedValue()
    userServiceMocks.setUserBlockedStatus.mockResolvedValue()
    userServiceMocks.authorizeUserEmail.mockResolvedValue({})
  })

  it("renderiza la lista de usuarios con sus respectivos roles y estados", () => {
    render(<UserRoleTable />)

    expect(screen.getByText("Gestión de Usuarios y Roles en Base de Datos")).toBeInTheDocument()
    expect(screen.getByText("master@empresa.com")).toBeInTheDocument()
    expect(screen.getByText("(Tú)")).toBeInTheDocument()
    expect(screen.getByText("empleado@metalconf.com")).toBeInTheDocument()
    expect(screen.getByText("Empleado Juan")).toBeInTheDocument()
    expect(screen.getAllByText("Habilitado")).toHaveLength(2)
  })

  it("permite cambiar el rol de un usuario empleado a master", async () => {
    render(<UserRoleTable />)

    const toggleBtn = screen.getByRole("button", { name: /asignar master/i })
    fireEvent.click(toggleBtn)

    await waitFor(() => {
      expect(userServiceMocks.updateUserRole).toHaveBeenCalledWith("u2", "master")
    })
  })

  it("permite bloquear y desbloquear a otro usuario", async () => {
    render(<UserRoleTable />)

    const blockButtons = screen.getAllByRole("button", { name: "Bloquear" })
    expect(blockButtons[0]).toBeDisabled()
    fireEvent.click(blockButtons[1])

    await waitFor(() => {
      expect(userServiceMocks.setUserBlockedStatus).toHaveBeenCalledWith("u2", true)
    })
  })

  it("permite crear y habilitar un nuevo correo con contraseña inicial desde el formulario", async () => {
    render(<UserRoleTable />)

    fireEvent.change(screen.getByLabelText("Correo a autorizar"), { target: { value: "pablopiliavsky21@gmail.com" } })
    fireEvent.change(screen.getByLabelText("Contraseña inicial"), { target: { value: "Pablo1234" } })
    fireEvent.change(screen.getByLabelText("Nombre del usuario"), { target: { value: "Pablo Piliavsky" } })
    fireEvent.click(screen.getByRole("button", { name: "Habilitar Correo" }))

    await waitFor(() => {
      expect(userServiceMocks.authorizeUserEmail).toHaveBeenCalledWith({
        email: "pablopiliavsky21@gmail.com",
        password: "Pablo1234",
        displayName: "Pablo Piliavsky",
        role: "empleado",
      })
    })
  })
})
