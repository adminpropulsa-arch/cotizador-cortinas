import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function MotorTableBody({ motores, canEdit, setEditTarget, handleOpenEditModal, deleteItem }) {
  return (
          <TableBody>
            {motores.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={canEdit ? 5 : 4} className="text-center py-6 text-xs text-zinc-500 italic">No hay motores registrados.</TableCell>
              </TableRow>
            ) : (
              motores.map((item) => (
                <TableRow key={item.code} className="border-zinc-800 hover:bg-zinc-800/60 transition-colors duration-150">
                  <TableCell className="text-zinc-200 font-mono text-xs">{item.code}</TableCell>
                  <TableCell className="text-zinc-200 font-medium text-xs">{item.name}</TableCell>
                  <TableCell className="text-zinc-200 font-mono text-xs">${item.price?.toFixed(2)} USD</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                      {item.compatibleAcc?.length ? (
                        item.compatibleAcc.map((c) => <span key={c} className="bg-zinc-900 border border-zinc-700/80 text-zinc-300 font-mono text-[10px] px-1.5 py-0.5 rounded">{c}</span>)
                      ) : <span className="text-zinc-500 italic text-xs">Ninguno</span>}
                    </div>
                  </TableCell>
                  {canEdit && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setEditTarget(item)} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white text-xs">Editar</Button>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(item)} className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-white hover:border-blue-400 text-xs">⚙️ Accs</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem(item.code)} className="bg-red-950/30 border border-red-900/50 text-red-300 hover:bg-red-600 hover:text-white transition-colors">Eliminar</Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
  )
}
