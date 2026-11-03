export default function BudgetTotals({ items, marginFactor, grandTotal }) {
  return <>
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto text-xs text-zinc-400 border-b border-zinc-800 pb-3">
        {items.length === 0 ? (
          <span className="text-zinc-500 italic text-center py-2">No hay cortinas en el presupuesto</span>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-1 rounded hover:bg-zinc-900/40 transition-colors">
              <span>{item.name} ({item.qty} un)</span>
              <span className="font-mono text-zinc-300">${((item.calcs?.total || 0) * marginFactor * item.qty).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center text-lg font-bold text-blue-400">
        <span>Gran Total:</span>
        <span className="font-mono text-xl">${grandTotal.toFixed(2)} USD</span>
      </div>

  </>
}
