import { useState } from "react"
import useCrud from "../hooks/useCrud"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import MotorTableBody from "./MotorTableBody"
import CreateElementDialog from "./CreateElementDialog"
import MotorCompatibilityModal from "./MotorCompatibilityModal"
import EditElementModal from "./EditElementModal"

export default function MotorCrudTable({ canEdit = true }) {
  const { items: motores, createItem, updateItem, deleteItem } = useCrud("motores")
  const { items: accesorios } = useCrud("accesorios")
  const [modalState, setModalState] = useState({ isOpen: false, mode: "new", targetMotor: null })
  const [editTarget, setEditTarget] = useState(null)

  const handleOpenEditModal = (motor) => setModalState({ isOpen: true, mode: "edit", targetMotor: motor })
  const handleCloseModal = () => setModalState({ isOpen: false, mode: "new", targetMotor: null })

  const handleSaveModalCompatibilities = async (selectedCodes) => {
    if (modalState.targetMotor) await updateItem(modalState.targetMotor.code, { compatibleAcc: selectedCodes })
  }

  return (
    <div className="flex flex-col gap-4 border border-zinc-800 p-4 rounded-lg bg-zinc-950/60 backdrop-blur-md">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">Sistemas de Motorización</h3>
        <p className="text-xs text-zinc-400">Administra los modelos de motor y los accesorios autorizados para cada uno.</p>
      </div>

      {canEdit && (
        <CreateElementDialog collection="motores" items={motores} onCreate={createItem} accesorios={accesorios} />
      )}

      <div className="rounded-md border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-900/50 border-zinc-800">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Código</TableHead>
              <TableHead className="text-zinc-400">Descripción</TableHead>
              <TableHead className="text-zinc-400">Precio/UN</TableHead>
              <TableHead className="text-zinc-400">Accesorios Compatibles</TableHead>
              {canEdit && <TableHead className="text-zinc-400 text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <MotorTableBody {...{ motores, canEdit, setEditTarget, handleOpenEditModal, deleteItem }} />
        </Table>
      </div>

      {canEdit && (
        <>
          <MotorCompatibilityModal
            accesorios={accesorios}
            motorName={modalState.targetMotor?.name || "Motor"}
            onClose={handleCloseModal}
            onSave={handleSaveModalCompatibilities}
            open={modalState.isOpen}
            selectedCodes={modalState.targetMotor?.compatibleAcc || []}
          />
          <EditElementModal item={editTarget} onClose={() => setEditTarget(null)} onSave={updateItem} open={Boolean(editTarget)} type="motor" />
        </>
      )}
    </div>
  )
}
