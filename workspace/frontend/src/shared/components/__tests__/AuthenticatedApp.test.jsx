import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import AuthenticatedApp from "../AuthenticatedApp"

const authState = { role: "empleado", isMaster: false }

vi.mock("@/shared/providers/AuthContext", () => ({
  useAuth: () => authState,
}))
vi.mock("@/shared/providers/BudgetContext", () => ({
  BudgetProvider: ({ children }) => <div data-testid="budget-provider">{children}</div>,
}))
vi.mock("@/shared/components/AppHeader", () => ({
  default: () => <div data-testid="app-header">Header</div>,
}))
vi.mock("@/features/estimator/components/EstimatorPage", () => ({
  default: () => <div data-testid="estimator-page">Cotizador</div>,
}))
vi.mock("@/features/admin/components/ConfigCrud", () => ({
  default: () => <div data-testid="config-crud">ConfigCrud</div>,
}))

describe("AuthenticatedApp", () => {
  it("oculta la pestaña de Configuración de elementos cuando el usuario es Empleado", () => {
    authState.role = "empleado"
    authState.isMaster = false

    render(<AuthenticatedApp onLogout={vi.fn()} user={{ email: "empleado@empresa.com" }} />)

    expect(screen.getByTestId("estimator-page")).toBeInTheDocument()
    expect(screen.queryByText("Configuración de elementos")).not.toBeInTheDocument()
    expect(screen.queryByTestId("config-crud")).not.toBeInTheDocument()
  })

  it("muestra la pestaña de Configuración de elementos cuando el usuario es Master", () => {
    authState.role = "master"
    authState.isMaster = true

    render(<AuthenticatedApp onLogout={vi.fn()} user={{ email: "master@empresa.com" }} />)

    expect(screen.getByText("Cotizador Cliente")).toBeInTheDocument()
    expect(screen.getByText("Configuración de elementos")).toBeInTheDocument()
  })
})
