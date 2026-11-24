import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ROLES, subscribeToUserProfile } from "@/features/auth/services/userService"

const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    let unsubProfile = () => undefined
    const unsubAuth = onAuthStateChanged(
      auth,
      (nextUser) => {
        unsubProfile()
        setUser(nextUser)
        if (nextUser) {
          setLoading(true)
          unsubProfile = subscribeToUserProfile(nextUser, (profile) => {
            setUserProfile(profile)
            setLoading(false)
          })
        } else {
          setUserProfile(null)
          setLoading(false)
        }
      },
      (error) => {
        setAuthError(error)
        setLoading(false)
      },
    )
    return () => {
      unsubAuth()
      unsubProfile()
    }
  }, [])

  const runAuth = useCallback(async (op) => {
    setAuthError(null)
    try {
      return await op()
    } catch (err) {
      setAuthError(err)
      throw err
    }
  }, [])

  const login = useCallback((email, pass) => runAuth(() => signInWithEmailAndPassword(auth, email, pass)), [runAuth])
  const logout = useCallback(async () => {
    setUser(null)
    setUserProfile(null)
    return runAuth(() => signOut(auth))
  }, [runAuth])

  const role = userProfile?.role ?? null
  const isBlocked = Boolean(userProfile?.blocked)
  const isMaster = !isBlocked && role === ROLES.MASTER
  const isEmpleado = !isBlocked && role === ROLES.EMPLEADO
  const isAuthorized = Boolean(user && userProfile && !isBlocked && (isMaster || isEmpleado))

  const value = useMemo(
    () => ({ user, userProfile, role, isMaster, isEmpleado, isBlocked, isAuthorized, loading, authError, login, logout }),
    [authError, isAuthorized, isBlocked, isEmpleado, isMaster, loading, login, logout, role, user, userProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
