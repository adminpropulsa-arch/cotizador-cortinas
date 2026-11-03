import { Button } from "@/components/ui/button"
import { generatePDF } from "@/shared/utils/pdfGenerator"

const pdfButtonClass = "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"

export default function PdfButtons({ budget, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" className={pdfButtonClass} disabled={disabled} onClick={() => generatePDF(budget, "internal")}>PDF interno</Button>
      <Button type="button" variant="outline" className={pdfButtonClass} disabled={disabled} onClick={() => generatePDF(budget, "client")}>PDF cliente</Button>
    </div>
  )
}
