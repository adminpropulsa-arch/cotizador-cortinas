import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccessoryPicker({ accesorios, selectedCodes, onChange, compatibleCodes }) {
  const id = useId()
  const [query, setQuery] = useState("")
  const compatible = (code) => !compatibleCodes || compatibleCodes.includes(code)
  const selected = accesorios.filter((acc) => selectedCodes.includes(acc.code))
  const matches = accesorios.filter((acc) =>
    [acc.name, acc.code, acc.category, acc.type].filter(Boolean).join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  const toggle = (code) => {
    if (!compatible(code)) return
    onChange(selectedCodes.includes(code) ? selectedCodes.filter((value) => value !== code) : [...selectedCodes, code])
  }
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <details className="rounded-md border border-zinc-700 bg-zinc-900">
        <summary className="cursor-pointer px-3 py-2 text-sm text-zinc-200 focus-visible:outline-2 focus-visible:outline-blue-500">
          Seleccionar accesorios ({selectedCodes.length})
        </summary>
        <div className="flex flex-col gap-2 border-t border-zinc-800 p-3">
          <Label htmlFor={id}>Buscar accesorios</Label>
          <Input id={id} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, código o categoría" />
          <div className="flex max-h-52 flex-col gap-1 overflow-y-auto" role="group" aria-label="Accesorios disponibles">
            {matches.map((acc) => (
              <label key={acc.code} className={`flex items-start gap-2 rounded p-2 text-sm ${compatible(acc.code) ? "cursor-pointer hover:bg-zinc-800" : "text-zinc-500"}`}>
                <input type="checkbox" checked={selectedCodes.includes(acc.code)} disabled={!compatible(acc.code)} onChange={() => toggle(acc.code)} className="mt-1 accent-blue-600" />
                <span className="min-w-0 flex-1 break-words">{acc.name}<small className="block text-xs text-zinc-400">{acc.code} · {acc.category || acc.type || "Accesorio"}{!compatible(acc.code) ? " · No compatible" : ""}</small></span>
                <span className="shrink-0 font-mono text-xs">${acc.price}</span>
              </label>
            ))}
            {!matches.length && <p className="p-2 text-sm text-zinc-400">No se encontraron accesorios.</p>}
          </div>
        </div>
      </details>
      <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto" aria-label="Accesorios seleccionados">
        {selected.map((acc) => <Button key={acc.code} variant="secondary" size="sm" type="button" aria-label={`Quitar ${acc.name}`} onClick={() => onChange(selectedCodes.filter((code) => code !== acc.code))} className="h-auto max-w-full whitespace-normal text-left text-xs">{acc.name} ×</Button>)}
      </div>
    </div>
  )
}
