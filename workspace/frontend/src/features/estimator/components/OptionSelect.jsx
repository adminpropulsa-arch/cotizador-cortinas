import { useId } from "react"
import { Label } from "@/components/ui/label"

export default function OptionSelect({ label, items, value, onChange }) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id} className="min-h-8 text-xs text-zinc-400">{label}</Label>
      <select id={id} value={value?.code || ""} onChange={(event) => onChange(items.find((item) => item.code === event.target.value))} className="h-10 w-full min-w-0 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-200">
        {!items.length && <option value="">Sin opciones disponibles</option>}
        {items.map((item) => <option key={item.code} value={item.code}>{item.name} (${item.price})</option>)}
      </select>
    </div>
  )
}
