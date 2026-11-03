import useBudgetSummary from "../hooks/useBudgetSummary"
import BudgetTotals from "./BudgetTotals"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PdfButtons from "./PdfButtons"
import MarginSelector from "./MarginSelector"

export default function EstimatorSummary({
  items = [],
  marginFactor = 1,
  selectedMarginId,
  setSelectedMarginId,
  customMarginPercentage,
  setCustomMarginPercentage,
  margins = [],
  isBlocked,
  clearBudget,
}) {
  const { client, setClient, grandTotal, activeMarginName, handleSave } = useBudgetSummary({ items, marginFactor, margins, selectedMarginId, isBlocked, clearBudget })

  return (
    <div className="flex flex-col gap-4 bg-zinc-950/60 p-4 border border-zinc-800 rounded-lg">
      <h3 className="text-md font-semibold text-zinc-200">Resumen y Desglose de Costos</h3>
      
      {isBlocked && (
        <div className="bg-amber-950/30 border border-amber-800/40 p-2.5 rounded text-amber-200 text-xs font-medium">
          🔒 Guardado Bloqueado: Activa el burlete obligatorio en la configuración actual.
        </div>
      )}

      <MarginSelector {...{ margins, selectedMarginId, setSelectedMarginId, customMarginPercentage, setCustomMarginPercentage }} />

      <BudgetTotals items={items} marginFactor={marginFactor} grandTotal={grandTotal} />

      <div className="flex flex-col gap-2 mt-2">
        <Input placeholder="Nombre del Cliente / Referencia" value={client} onChange={(e) => setClient(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 focus:border-blue-500 transition-colors" />
        <div className="flex flex-col gap-2">
          <PdfButtons budget={{ client, items, marginName: activeMarginName, marginFactor }} disabled={items.length === 0 || isBlocked} />
          <Button onClick={handleSave} disabled={!client || items.length === 0 || isBlocked} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50">Guardar Presupuesto</Button>
        </div>
      </div>
    </div>
  )
}
