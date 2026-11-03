import { useEffect } from "react"
import useShutterCalculations from "./useShutterCalculations"

export default function useCurtainSync(activeItem, setBudgetItems, catalog) {
  const { lamas, ejes, guias, cajones, motores } = catalog
  const calcs = useShutterCalculations(activeItem)
  useEffect(() => {
    if (!lamas?.length || !ejes?.length || !guias?.length || !cajones?.length || !motores?.length) return
    setBudgetItems((current) => current.map((item) => item.selectedLama ? item : {
      ...item, selectedLama: lamas[0], selectedEje: ejes[0], selectedGuide: guias[0],
      selectedCajon: cajones[0], selectedMotor: motores[0],
    }))
  }, [lamas, ejes, guias, cajones, motores, setBudgetItems])
  const id = activeItem.id
  useEffect(() => {
    setBudgetItems((current) => current.map((item) =>
      item.id === id && Object.keys(calcs).some((key) => item.calcs?.[key] !== calcs[key]) ? { ...item, calcs } : item,
    ))
  }, [id, calcs, setBudgetItems])
}
