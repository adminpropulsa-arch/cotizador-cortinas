import { useEffect, useState } from "react"
import { useAuth } from "@/shared/providers/AuthContext"
import { ROLES, normalizeEmail, setUserBlockedStatus, subscribeToAllUsers, updateUserRole } from "@/features/auth/services/userService"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AuthorizeUserForm from "./AuthorizeUserForm"
import UserRoleRow from "./UserRoleRow"

export default function UserRoleTable() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((fetchedUsers) => {
      setUsers(fetchedUsers)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function handleToggleRole(targetUser) {
    const targetId = targetUser.id || targetUser.uid
    const nextRole = targetUser.role === ROLES.MASTER ? ROLES.EMPLEADO : ROLES.MASTER
    setUpdatingId(targetId)
    try {
      await updateUserRole(targetId, nextRole)
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleToggleBlocked(targetUser) {
    const targetId = targetUser.id || targetUser.uid
    setUpdatingId(targetId)
    try {
      await setUserBlockedStatus(targetId, !targetUser.blocked)
    } finally {
      setUpdatingId(null)
    }
  }

  const currentEmail = normalizeEmail(currentUser?.email)

  return (
    <div className="flex flex-col gap-4 border border-zinc-800 p-4 rounded-lg bg-zinc-950/60 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Gestión de Usuarios y Roles en Base de Datos</h3>
          <p className="text-xs text-zinc-400">Habilita correos autorizados, asigna roles (Master / Empleado) y bloquea o desbloquea el acceso.</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
          Total: {users.length} usuarios
        </span>
      </div>

      <AuthorizeUserForm />

      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50 border-zinc-800">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Usuario / Correo</TableHead>
              <TableHead className="text-zinc-400">Nombre</TableHead>
              <TableHead className="text-zinc-400 text-center">Rol Actual</TableHead>
              <TableHead className="text-zinc-400 text-center">Estado</TableHead>
              <TableHead className="text-zinc-400 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-6">Cargando usuarios de la base de datos...</TableCell>
              </TableRow>
            )}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-6">No hay usuarios registrados aún.</TableCell>
              </TableRow>
            )}
            {users.map((item) => {
              const itemId = item.id || item.uid
              const isSelf = item.uid === currentUser?.uid || (currentEmail && normalizeEmail(item.email) === currentEmail)
              return (
                <UserRoleRow
                  key={itemId}
                  isBusy={updatingId === itemId}
                  isSelf={Boolean(isSelf)}
                  item={item}
                  onToggleBlocked={handleToggleBlocked}
                  onToggleRole={handleToggleRole}
                />
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
