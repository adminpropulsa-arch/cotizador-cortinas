import OptionSelect from "./OptionSelect"

export default function VueloOptions({ hasVuelo, setHasVuelo, addVueloMeasure, setAddVueloMeasure, cajones, selectedCajon, setSelectedCajon, ejes, selectedEje, setSelectedEje }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={hasVuelo} onChange={(event) => {
          setHasVuelo(event.target.checked)
          if (!event.target.checked) setAddVueloMeasure(false)
        }} />
        ¿Lleva Vuelo?
      </label>
      {hasVuelo && <div className="flex flex-col gap-3 border-l border-zinc-800 pl-4">
        <label className="flex items-start gap-2 text-xs text-zinc-400">
          <input type="checkbox" checked={addVueloMeasure} onChange={(event) => setAddVueloMeasure(event.target.checked)} />
          ¿Sumar medida de vuelo al alto (+40 cm)?
        </label>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
          <OptionSelect label="Modelo de Cajón (Vuelo)" items={cajones} value={selectedCajon} onChange={setSelectedCajon} />
          <OptionSelect label="Modelo de Eje/Tubo" items={ejes} value={selectedEje} onChange={setSelectedEje} />
        </div>
      </div>}
    </div>
  )
}
