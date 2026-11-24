import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, expect, it, vi } from "vitest"
import AuthProvider, { useAuth } from "../../../shared/providers/AuthContext"

const firebaseMocks = vi.hoisted(() => ({
  auth: {},
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}))

const profileRegistry = {
  "master@empresa.com": { uid: "user-master", email: "master@empresa.com", role: "master", blocked: false },
  "empleado@empresa.com": { uid: "user-emp", email: "empleado@empresa.com", role: "empleado", blocked: false },
  "bloqueado@empresa.com": { uid: "user-blk", email: "bloqueado@empresa.com", role: "empleado", blocked: true },
}

vi.mock("firebase/auth", () => firebaseMocks)
vi.mock("@/lib/firebase", () => ({ auth: firebaseMocks.auth, db: {} }))
vi.mock("@/features/auth/services/userService", () => ({
  ROLES: { MASTER: "master", EMPLEADO: "empleado" },
  subscribeToUserProfile: (user, callback) => {
    callback(profileRegistry[user.email] ?? null)
    return vi.fn()
  },
}))

let authStateListener

function Wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

beforeEach(() => {
  vi.clearAllMocks()
  firebaseMocks.onAuthStateChanged.mockImplementation((_auth, listener) => {
    authStateListener = listener
    listener(null)
    return vi.fn()
  })
})

async function renderAuthHook() {
  const hook = renderHook(() => useAuth(), { wrapper: Wrapper })
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  return hook
}

it("inicia sesión y autoriza solo si el usuario existe y está habilitado en la base de datos", async () => {
  const user = { email: "master@empresa.com", uid: "user-master" }
  firebaseMocks.signInWithEmailAndPassword.mockResolvedValue({ user })
  const { result } = await renderAuthHook()

  await act(async () => {
    await result.current.login(user.email, "Secret123")
  })
  act(() => authStateListener(user))

  expect(firebaseMocks.signInWithEmailAndPassword).toHaveBeenCalledWith(firebaseMocks.auth, user.email, "Secret123")
  expect(result.current.user).toEqual(user)
  expect(result.current.isAuthorized).toBe(true)
  expect(result.current.isMaster).toBe(true)
  expect(result.current.isEmpleado).toBe(false)
})

it("deniega autorización a correos inexistentes en la colección usuarios (incluyendo antiguos emails por defecto)", async () => {
  const { result } = await renderAuthHook()

  act(() => authStateListener({ email: "admin@propulsa.com", uid: "unregistered-uid" }))

  expect(result.current.userProfile).toBeNull()
  expect(result.current.role).toBeNull()
  expect(result.current.isMaster).toBe(false)
  expect(result.current.isAuthorized).toBe(false)
})

it("marca como bloqueado y no autorizado a un usuario con blocked: true", async () => {
  const { result } = await renderAuthHook()

  act(() => authStateListener({ email: "bloqueado@empresa.com", uid: "user-blk" }))

  expect(result.current.isBlocked).toBe(true)
  expect(result.current.isAuthorized).toBe(false)
  expect(result.current.isEmpleado).toBe(false)
})

it("guarda y propaga los errores de credenciales", async () => {
  const error = { code: "auth/invalid-credential" }
  firebaseMocks.signInWithEmailAndPassword.mockRejectedValue(error)
  const { result } = await renderAuthHook()

  await act(async () => {
    await expect(result.current.login("empleado@empresa.com", "incorrecta")).rejects.toBe(error)
  })

  expect(result.current.authError).toBe(error)
})

it("cierra sesión y limpia el usuario activo de inmediato", async () => {
  const { result } = await renderAuthHook()
  let finishSignOut
  firebaseMocks.signOut.mockImplementation(() => new Promise((resolve) => {
    finishSignOut = resolve
  }))
  act(() => authStateListener({ email: "empleado@empresa.com", uid: "user-emp" }))

  let logoutPromise
  act(() => {
    logoutPromise = result.current.logout()
  })

  expect(firebaseMocks.signOut).toHaveBeenCalledWith(firebaseMocks.auth)
  expect(result.current.user).toBeNull()

  await act(async () => {
    finishSignOut()
    await logoutPromise
  })
})
