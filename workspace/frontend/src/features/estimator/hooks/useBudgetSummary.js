import { useState } from "react"
import { useBudget } from "@/shared/providers/BudgetContext"

export default function useBudgetSummary({ items, marginFactor, margins, selectedMarginId, isBlocked, clearBudget }) {
  const { saveBudget } = useBudget()
  const [client, setClient] = useState("")

  const grandTotal = items.reduce((sum, item) => sum + ((item.calcs?.total || 0) * marginFactor * item.qty), 0)

  const activeMargin = margins.find(m => m.id === selectedMarginId)
  const activeMarginName = selectedMarginId === "custom" 
    ? "Personalizado" 
    : activeMargin?.name || margins[0]?.name || "Gremio"

  const handleSave = () => {
    if (!client || items.length === 0 || isBlocked) return
    saveBudget({
      client,
      items,
      marginName: activeMarginName,
      marginFactor,
      grandTotal,
    })
    setClient("")
    clearBudget()
  }

  return { client, setClient, grandTotal, activeMarginName, handleSave }
}
