import { useState } from "react"
import { useAuth } from "@/shared/providers/AuthContext"
import getAuthErrorMessage from "../utils/getAuthErrorMessage"

export default function useLoginForm(onAuthenticated) {
  const { login, register } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const title = isRegistering ? "Crear Cuenta" : "Iniciar Sesión"

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      setFormError("Completá el correo y la contraseña.")
      return
    }

    setFormError(null)
    setIsSubmitting(true)

    try {
      await (isRegistering ? register : login)(email.trim(), password)
      onAuthenticated()
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleMode() {
    setIsRegistering((current) => !current)
    setFormError(null)
  }

  return { isRegistering, email, password, formError, isSubmitting, title, setEmail, setPassword, handleSubmit, toggleMode }
}
