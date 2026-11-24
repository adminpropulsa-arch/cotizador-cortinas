import { ROLES } from "@/features/auth/services/userService"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function UserRoleRow({ item, isSelf, isBusy, onToggleRole, onToggleBlocked }) {
  const isItemMaster = item.role === ROLES.MASTER
  const isBlocked = Boolean(item.blocked)
  const disableSelfLock = isSelf && isItemMaster

  return (
    <TableRow className="border-zinc-800 hover:bg-zinc-800/60 transition-colors">
      <TableCell className="text-zinc-200 font-medium text-xs">
        {item.email}
        {isSelf && <span className="ml-2 text-[10px] text-blue-400 font-mono">(Tú)</span>}
      </TableCell>
      <TableCell className="text-zinc-300 text-xs">{item.displayName || "—"}</TableCell>
      <TableCell className="text-center">
        <span className={`inline-flex items-center justify-center text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold border ${
          isItemMaster ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-zinc-800 text-zinc-400 border-zinc-700"
        }`}>
          {isItemMaster ? "Master" : "Empleado"}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span className={`inline-flex items-center justify-center text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold border ${
          isBlocked ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        }`}>
          {isBlocked ? "Bloqueado" : "Habilitado"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white text-xs h-7"
            disabled={isBusy || disableSelfLock}
            onClick={() => onToggleRole(item)}
            size="sm"
            variant="outline"
          >
            {isItemMaster ? "Cambiar a Empleado" : "Asignar Master"}
          </Button>
          <Button
            className={`text-xs h-7 border ${
              isBlocked
                ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50"
                : "border-red-800/60 bg-red-950/40 text-red-300 hover:bg-red-900/50"
            }`}
            disabled={isBusy || isSelf}
            onClick={() => onToggleBlocked(item)}
            size="sm"
            variant="outline"
          >
            {isBlocked ? "Desbloquear" : "Bloquear"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
