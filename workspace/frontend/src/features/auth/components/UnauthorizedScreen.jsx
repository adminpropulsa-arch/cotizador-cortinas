import { Button } from "@/components/ui/button"

export default function UnauthorizedScreen({ user, isBlocked, onLogout }) {
  const title = isBlocked ? "Cuenta Bloqueada" : "Cuenta No Habilitada"
  const description = isBlocked
    ? "Tu acceso al cotizador fue suspendido temporalmente por un administrador."
    : "Tu cuenta no se encuentra habilitada en el padrón de usuarios autorizados."

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-50">
      <section className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-2xl shadow-black/30 text-center">
        <span className="rounded bg-red-600/20 border border-red-500/40 px-2.5 py-1 font-mono text-xs font-semibold text-red-300">
          ACCESO RESTRINGIDO
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">{title}</h1>
        {user?.email && <p className="mt-1 font-mono text-xs text-zinc-400">{user.email}</p>}
        <p className="mt-4 text-sm text-zinc-300">{description}</p>
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Si tenés algún problema para autenticarte, comunicate con <strong className="text-zinc-200">Grupo Gonzalez</strong> para consultas.
        </p>
        <Button
          className="mt-6 h-10 w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
          onClick={onLogout}
          type="button"
        >
          Cerrar Sesión
        </Button>
      </section>
    </main>
  )
}
