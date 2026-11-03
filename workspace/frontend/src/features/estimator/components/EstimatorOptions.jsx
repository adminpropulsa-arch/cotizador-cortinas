import AccessoryPicker from "@/shared/components/AccessoryPicker"
import OptionSelect from "./OptionSelect"
import VueloOptions from "./VueloOptions"
import { hasMissingGasket } from "../hooks/initialCurtain"

export default function EstimatorOptions(props) {
  const { motores, selectedMotor, setSelectedMotor, accesorios, selectedAccs, setSelectedAccs, selectedLama } = props
  const compatibleCodes = selectedMotor?.compatibleAcc || []
  const missingGasket = hasMissingGasket({ selectedAccs, selectedMotor, selectedLama })
  const changeMotor = (motor) => {
    setSelectedMotor(motor)
    setSelectedAccs((current) => current.filter((acc) => motor?.compatibleAcc?.includes(acc.code)))
  }
  const changeAccessories = (codes) => setSelectedAccs(accesorios.filter((acc) => codes.includes(acc.code) && compatibleCodes.includes(acc.code)))
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
      <h3 className="font-semibold text-zinc-200">Opciones Adicionales</h3>
      {missingGasket && <p role="alert" className="rounded-md border border-amber-800/60 bg-amber-950/40 p-3 text-xs text-amber-200">
        La lama seleccionada requiere obligatoriamente un <strong>Burlete</strong>. Seleccioná uno compatible con el motor.
      </p>}
      <VueloOptions {...props} />
      <div className="border-t border-zinc-800/60 pt-3">
        <OptionSelect label="Motorización" items={motores} value={selectedMotor} onChange={changeMotor} />
      </div>
      <fieldset className="min-w-0 border-t border-zinc-800/60 pt-3">
        <legend className="text-sm font-medium text-zinc-300">Accesorios y Componentes</legend>
        <AccessoryPicker accesorios={accesorios} compatibleCodes={compatibleCodes} selectedCodes={selectedAccs.map((acc) => acc.code)} onChange={changeAccessories} />
      </fieldset>
    </div>
  )
}
