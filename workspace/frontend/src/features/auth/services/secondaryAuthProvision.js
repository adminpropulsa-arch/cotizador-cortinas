import { deleteApp, initializeApp } from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth"
import { firebaseApp } from "@/lib/firebase"
import getAuthErrorMessage from "../utils/getAuthErrorMessage"

export async function createSecondaryAuthUser(email, password) {
  if (!password || password.length < 6) {
    throw new Error("La contraseña inicial debe tener al menos 6 caracteres")
  }

  const secondaryAppName = `secondary-Provision-${Date.now()}`
  const secondaryApp = initializeApp(firebaseApp.options, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    const createdUid = credential.user.uid
    await signOut(secondaryAuth)
    return createdUid
  } catch (err) {
    if (err?.code === "auth/email-already-in-use") {
      return null
    }
    throw new Error(getAuthErrorMessage(err))
  } finally {
    await deleteApp(secondaryApp).catch(() => undefined)
  }
}
