import { useState } from "react"
import { ROLES, authorizeUserEmail } from "@/features/auth/services/userService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthorizeUserForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState(ROLES.EMPLEADO)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleAddUser(event) {
    event.preventDefault()
    if (!email.trim() || !password) return
    setError(null)
    setSubmitting(true)
    try {
      await authorizeUserEmail({ email, password, displayName, role })
      setEmail("")
      setPassword("")
      setDisplayName("")
      setRole(ROLES.EMPLEADO)
    } catch (err) {
      setError(err.message || "No se pudo autorizar el correo.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-900/40 p-3" onSubmit={handleAddUser}>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          aria-label="Correo a autorizar"
          className="h-8 flex-1 min-w-44 border-zinc-800 bg-zinc-950 text-xs text-zinc-100"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@empresa.com"
          required
          type="email"
          value={email}
        />
        <Input
          aria-label="Contraseña inicial"
          className="h-8 w-40 border-zinc-800 bg-zinc-950 text-xs text-zinc-100"
          minLength={6}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (mín. 6)"
          required
          type="password"
          value={password}
        />
        <Input
          aria-label="Nombre del usuario"
          className="h-8 w-40 border-zinc-800 bg-zinc-950 text-xs text-zinc-100"
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre (opcional)"
          type="text"
          value={displayName}
        />
        <select
          aria-label="Rol inicial"
          className="h-8 w-32 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-0 text-center text-xs leading-none text-zinc-200 outline-none focus-visible:border-ring"
          onChange={(e) => setRole(e.target.value)}
          value={role}
        >
          <option value={ROLES.EMPLEADO}>Empleado</option>
          <option value={ROLES.MASTER}>Master</option>
        </select>
        <Button className="h-8 bg-blue-600 text-xs text-white hover:bg-blue-500" disabled={submitting} size="sm" type="submit">
          {submitting ? "Creando..." : "Habilitar Correo"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
    </form>
  )
}
