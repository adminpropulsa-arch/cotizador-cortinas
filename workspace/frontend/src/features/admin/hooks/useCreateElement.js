import { useState } from "react"
import { CREATE_SCHEMAS, prepareNewElement } from "../components/createElementSchema"

export default function useCreateElement(collection, onCreate, items) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const schema = CREATE_SCHEMAS[collection]
  const [draft, setDraft] = useState(() => ({ ...schema.defaults }))
  const changeOpen = (next) => {
    if (saving) return
    if (next) {
      setDraft({ ...schema.defaults })
      setError("")
    }
    setOpen(next)
  }
  const submit = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError("")
    try {
      await onCreate(prepareNewElement(collection, draft, items))
      setOpen(false)
    } catch (failure) { setError(failure.message || "No se pudo guardar el elemento.") }
    finally { setSaving(false) }
  }
  return { open, saving, error, schema, draft, setDraft, changeOpen, submit }
}
