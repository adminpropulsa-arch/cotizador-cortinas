export const INITIAL_ITEM = {
  id: "1", name: "C1", width: "1.50", height: "2.00", qty: 1,
  hasGuides: true, hasVuelo: true, addVueloMeasure: false,
  selectedLama: null, selectedEje: null, selectedGuide: null,
  selectedCajon: null, selectedMotor: null, selectedAccs: [],
}

export function hasMissingGasket(item) {
  if (!item?.selectedLama?.requiredGasketCode) return false
  return !item.selectedAccs?.some((acc) => acc.code.startsWith("BUR") && item.selectedMotor?.compatibleAcc?.includes(acc.code))
}

export function getLamaAccessories(item, lama, accesorios) {
  const compatible = item.selectedMotor?.compatibleAcc || []
  let selected = (item.selectedAccs || []).filter((acc) => compatible.includes(acc.code))
  if (lama?.requiredGasketCode) {
    const gasket = accesorios.find((acc) => acc.code === lama.requiredGasketCode && compatible.includes(acc.code))
    if (gasket && !selected.some((acc) => acc.code === gasket.code)) selected = [...selected, gasket]
  } else selected = selected.filter((acc) => acc.code !== "BUR001" && acc.code !== "BUR002")
  return selected
}
