import { useState } from "react"
import useCrud from "../hooks/useCrud"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CreateElementDialog from "./CreateElementDialog"
import { Button } from "@/components/ui/button"
import EditElementModal from "./EditElementModal"

export default function AccesorioCrudTable({ canEdit = true }) {
  const { items: accesorios, createItem, updateItem, deleteItem } = useCrud("accesorios")
  const [editTarget, setEditTarget] = useState(null)

  const handleDelete = (code) => deleteItem(code)

  return (
    <div className="flex flex-col gap-4 border border-zinc-800 p-4 rounded-lg bg-zinc-950/60 backdrop-blur-md">
      <h3 className="text-lg font-semibold text-zinc-100">Accesorios y Componentes</h3>
      {canEdit && <CreateElementDialog collection="accesorios" items={accesorios} onCreate={createItem} />}

      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50 border-zinc-800">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Código</TableHead>
              <TableHead className="text-zinc-400">Descripción</TableHead>
              <TableHead className="text-zinc-400">Precio/UN</TableHead>
              {canEdit && <TableHead className="text-zinc-400 text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accesorios.map((item) => (
              <TableRow key={item.code} className="border-zinc-800 hover:bg-zinc-800/60 transition-colors duration-150">
                <TableCell className="text-zinc-200 font-mono text-xs">{item.code}</TableCell>
                <TableCell className="text-zinc-200 font-medium text-xs">{item.name}</TableCell>
                <TableCell className="text-zinc-200 font-mono text-xs">${item.price.toFixed(2)} USD</TableCell>
                {canEdit && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setEditTarget(item)} className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white text-xs">Editar</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.code)} className="bg-red-950/30 border border-red-900/50 text-red-300 hover:bg-red-600 hover:text-white transition-colors">Eliminar</Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditElementModal item={editTarget} onClose={() => setEditTarget(null)} onSave={updateItem} open={Boolean(editTarget)} type="accesorio" />
    </div>
  )
}
