import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  ROLES,
  authorizeUserEmail,
  normalizeEmail,
  setUserBlockedStatus,
  subscribeToUserProfile,
  updateUserRole,
} from "../userService"

const firestoreMocks = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn((_db, col, id) => ({ col, id })),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}))

const secondaryAuthMocks = vi.hoisted(() => ({
  createSecondaryAuthUser: vi.fn(),
}))

vi.mock("firebase/firestore", () => firestoreMocks)
vi.mock("@/lib/firebase", () => ({ db: {} }))
vi.mock("../secondaryAuthProvision", () => secondaryAuthMocks)

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    secondaryAuthMocks.createSecondaryAuthUser.mockResolvedValue("uid-generado-123")
  })

  it("normaliza correos electrónicos a minúsculas sin espacios", () => {
    expect(normalizeEmail("  ADMIN@Propulsa.com ")).toBe("admin@propulsa.com")
    expect(normalizeEmail(null)).toBe("")
  })

  it("no asigna roles master ni crea perfiles automáticamente si el documento no existe", () => {
    firestoreMocks.onSnapshot.mockImplementation((_ref, onNext) => {
      onNext({ exists: () => false })
      return vi.fn()
    })

    const onProfile = vi.fn()
    subscribeToUserProfile({ uid: "u-no-registrado", email: "admin@propulsa.com" }, onProfile)

    expect(onProfile).toHaveBeenCalledWith(null)
    expect(firestoreMocks.setDoc).not.toHaveBeenCalled()
  })

  it("valida parámetros en updateUserRole y setUserBlockedStatus", async () => {
    await expect(updateUserRole("", ROLES.MASTER)).rejects.toThrow("Se requiere UID del usuario")
    await expect(updateUserRole("uid123", "rol_inexistente")).rejects.toThrow("Rol inválido")
    await expect(setUserBlockedStatus("", true)).rejects.toThrow("Se requiere identificador del usuario")
  })

  it("actualiza el estado de bloqueo de un usuario en Firestore", async () => {
    firestoreMocks.updateDoc.mockResolvedValue()
    await setUserBlockedStatus("empleado@metalconf.com", true)

    expect(firestoreMocks.updateDoc).toHaveBeenCalledWith(
      { col: "usuarios", id: "empleado@metalconf.com" },
      expect.objectContaining({ blocked: true }),
    )
  })

  it("crea la cuenta en Firebase Auth y habilita el perfil en Firestore con rol específico", async () => {
    firestoreMocks.getDoc.mockResolvedValue({ exists: () => false })
    firestoreMocks.setDoc.mockResolvedValue()

    const created = await authorizeUserEmail({
      email: "Nuevo@Empresa.com",
      password: "Password123",
      displayName: "Nuevo Vendedor",
      role: ROLES.EMPLEADO,
    })

    expect(secondaryAuthMocks.createSecondaryAuthUser).toHaveBeenCalledWith("nuevo@empresa.com", "Password123")
    expect(created.uid).toBe("uid-generado-123")
    expect(created.email).toBe("nuevo@empresa.com")
    expect(created.role).toBe(ROLES.EMPLEADO)
    expect(created.blocked).toBe(false)
    expect(firestoreMocks.setDoc).toHaveBeenCalledTimes(1)
  })
})
