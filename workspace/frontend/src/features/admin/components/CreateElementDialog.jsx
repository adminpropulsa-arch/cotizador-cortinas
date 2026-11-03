import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import CreateElementFields from "./CreateElementFields"
import useCreateElement from "../hooks/useCreateElement"

export default function CreateElementDialog({ collection, onCreate, items, accesorios = [] }) {
  const { open, saving, error, schema, draft, setDraft, changeOpen, submit } = useCreateElement(collection, onCreate, items)
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger render={<Button type="button" className="self-start" />}>Agregar {schema.title}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-lg" showCloseButton={!saving}>
        <DialogHeader>
          <DialogTitle>Crear {schema.title}</DialogTitle>
          <DialogDescription>Completá los datos del nuevo elemento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex min-w-0 flex-col gap-5">
          <fieldset disabled={saving} className="min-w-0">
            <CreateElementFields collection={collection} fields={schema.fields} draft={draft} setDraft={setDraft} accesorios={accesorios} />
          </fieldset>
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={saving} onClick={() => changeOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : `Crear ${schema.title}`}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
