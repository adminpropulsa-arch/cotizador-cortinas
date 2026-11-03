import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useLoginForm from "../hooks/useLoginForm"

export default function LoginPage({ onAuthenticated }) {
  const { isRegistering, email, password, formError, isSubmitting, title, setEmail, setPassword, handleSubmit, toggleMode } = useLoginForm(onAuthenticated)

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-50">
      <section className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <span className="rounded bg-blue-600 px-2 py-1 font-mono text-xs font-semibold text-white">COR</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-zinc-400">Metalconf Cotizador</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label className="text-zinc-300" htmlFor="auth-email">Correo electrónico</Label>
            <Input className="h-10 border-zinc-800 bg-zinc-900 text-zinc-100" id="auth-email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-zinc-300" htmlFor="auth-password">Contraseña</Label>
            <Input className="h-10 border-zinc-800 bg-zinc-900 text-zinc-100" id="auth-password" minLength="6" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
          </div>

          {formError ? <p className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">{formError}</p> : null}

          <Button className="h-10 w-full bg-blue-600 text-white hover:bg-blue-500" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Procesando..." : title}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {isRegistering ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}
          <Button className="ml-1 h-auto p-0 text-blue-400 hover:bg-transparent hover:text-blue-300" onClick={toggleMode} type="button" variant="link">
            {isRegistering ? "Iniciar Sesión" : "Crear una cuenta"}
          </Button>
        </p>
      </section>
    </main>
  )
}
