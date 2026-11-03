import { useId } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AccessoryPicker from "@/shared/components/AccessoryPicker"

export default function CreateElementFields({ collection, fields, draft, setDraft, accesorios }) {
  const prefix = useId()
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }))
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map(({ key, label, ...props }) => <div key={key} className="flex min-w-0 flex-col gap-2">
        <Label htmlFor={`${prefix}-${key}`} className="min-h-5">{label}</Label>
        <Input {...props} id={`${prefix}-${key}`} required value={draft[key]} onChange={(event) => update(key, event.target.value)} className="h-10" />
      </div>)}
      {collection === "lamas" && <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor={`${prefix}-gasket`}>Burlete requerido</Label>
        <select id={`${prefix}-gasket`} value={draft.requiredGasketCode} onChange={(event) => update("requiredGasketCode", event.target.value)} className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3">
          <option value="">Sin burlete</option>
          {accesorios.filter((acc) => acc.code.startsWith("BUR") || acc.name.toLowerCase().includes("burlete")).map((acc) => <option key={acc.code} value={acc.code}>{acc.name}</option>)}
        </select>
      </div>}
      {collection === "motores" && <fieldset className="min-w-0 sm:col-span-2">
        <legend className="mb-2 text-sm font-medium">Accesorios compatibles</legend>
        <AccessoryPicker accesorios={accesorios} selectedCodes={draft.compatibleAcc} onChange={(codes) => update("compatibleAcc", codes)} />
      </fieldset>}
    </div>
  )
}
