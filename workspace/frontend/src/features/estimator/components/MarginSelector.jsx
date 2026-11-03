import { Input } from "@/components/ui/input"

export default function MarginSelector({ margins, selectedMarginId, setSelectedMarginId, customMarginPercentage, setCustomMarginPercentage }) {
  return (
<div className="flex flex-col gap-2 border-b border-zinc-800 pb-3">
        <span className="text-xs text-zinc-400 font-semibold">Tarifa / Margen</span>
        <div className="flex flex-wrap gap-2">
          {margins.map(m => (
            <label key={m.id} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-lg cursor-pointer transition-all duration-150 ${
              selectedMarginId === m.id 
                ? "bg-white text-zinc-950 border-white font-semibold shadow-sm" 
                : "bg-zinc-900/70 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
            }`}>
              <input type="radio" name="margin" checked={selectedMarginId === m.id} onChange={() => setSelectedMarginId(m.id)} className="hidden" />
              <span>{m.name}</span>
            </label>
          ))}
          <label className={`flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded-lg cursor-pointer transition-all duration-150 ${
            selectedMarginId === "custom" 
              ? "bg-white text-zinc-950 border-white font-semibold shadow-sm" 
              : "bg-zinc-900/70 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white"
          }`}>
            <input type="radio" name="margin" checked={selectedMarginId === "custom"} onChange={() => setSelectedMarginId("custom")} className="hidden" />
            <span>Personalizado</span>
          </label>
        </div>

        {selectedMarginId === "custom" && (
          <div className="mt-2 flex gap-2 items-center">
            <span className="text-xs text-zinc-400">Porcentaje:</span>
            <Input type="number" min="0" value={customMarginPercentage} onChange={(e) => setCustomMarginPercentage(parseFloat(e.target.value) || 0)} className="bg-zinc-900 border-zinc-800 text-zinc-200 h-8 text-xs w-24 hover:border-zinc-700 focus:border-blue-500 transition-colors" />
            <span className="text-xs text-zinc-400 font-mono font-bold">%</span>
          </div>
        )}
      </div>
  )
}
