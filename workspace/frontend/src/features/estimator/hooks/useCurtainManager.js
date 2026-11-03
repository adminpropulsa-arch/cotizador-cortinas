import { useState } from "react"
import { useBudget } from "@/shared/providers/BudgetContext"
import useCurtainSync from "./useCurtainSync"
import { INITIAL_ITEM, getLamaAccessories, hasMissingGasket } from "./initialCurtain"

export default function useCurtainManager() {
  const { lamas, ejes, guias, cajones, motores, accesorios } = useBudget()
  const [budgetItems, setBudgetItems] = useState([INITIAL_ITEM])
  const [activeItemId, setActiveItemId] = useState("1")

  const activeItem = budgetItems.find((item) => item.id === activeItemId) || budgetItems[0]
  useCurtainSync(activeItem, setBudgetItems, { lamas, ejes, guias, cajones, motores })

  const updateActiveItem = (key, value) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === activeItemId ? { ...item, [key]: value } : item))
    )
  }

  const handleLamaChange = (lama) => {
    if (!activeItem) return
    const nextAccs = getLamaAccessories(activeItem, lama, accesorios)
    setBudgetItems((prev) =>
      prev.map((item) =>
        item.id === activeItemId
          ? { ...item, selectedLama: lama, selectedAccs: nextAccs }
          : item
      )
    )
  }

  const handleAddDesign = () => {
    const nextNum = budgetItems.length + 1
    const newId = Date.now().toString()
    const newItem = {
      ...INITIAL_ITEM,
      id: newId,
      name: `C${nextNum}`,
      selectedLama: lamas?.[0] || null,
      selectedEje: ejes?.[0] || null,
      selectedGuide: guias?.[0] || null,
      selectedCajon: cajones?.[0] || null,
      selectedMotor: motores?.[0] || null,
      calcs: null,
    }
    setBudgetItems((prev) => [...prev, newItem])
    setActiveItemId(newId)
  }

  const handleRemoveCurtain = (id, e) => {
    e.stopPropagation()
    if (budgetItems.length <= 1) return
    setBudgetItems((prev) => prev.filter((item) => item.id !== id))
    if (activeItemId === id) {
      const remaining = budgetItems.filter((item) => item.id !== id)
      setActiveItemId(remaining[0].id)
    }
  }

  const handleClearBudget = () => {
    const defaultId = Date.now().toString()
    setBudgetItems([{ ...INITIAL_ITEM, id: defaultId, calcs: null }])
    setActiveItemId(defaultId)
  }

  const isGasketRequiredButMissing = budgetItems.some(hasMissingGasket)

  return {
    budgetItems,
    activeItem,
    activeItemId,
    setActiveItemId,
    updateActiveItem,
    handleLamaChange,
    handleAddDesign,
    handleRemoveCurtain,
    handleClearBudget,
    isGasketRequiredButMissing,
    lamas,
    guias,
    cajones,
    ejes,
    motores,
    accesorios,
  }
}
