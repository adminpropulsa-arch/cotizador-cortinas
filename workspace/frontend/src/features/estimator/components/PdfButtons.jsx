import { Button } from "@/components/ui/button"
import { generatePDF } from "@/shared/utils/pdfGenerator"

export default function PdfButtons({ budget, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" disabled={disabled} onClick={() => generatePDF(budget, "internal")}>PDF interno</Button>
      <Button type="button" variant="outline" disabled={disabled} onClick={() => generatePDF(budget, "client")}>PDF cliente</Button>
    </div>
  )
}
