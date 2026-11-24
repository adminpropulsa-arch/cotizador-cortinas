import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { createSecondaryAuthUser } from "./secondaryAuthProvision"

export const ROLES = Object.freeze({ MASTER: "master", EMPLEADO: "empleado" })

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : ""
}

function mapSnapshotDoc(snapshotDoc) {
  const data = snapshotDoc.data()
  return { ...data, id: snapshotDoc.id, uid: data.uid || snapshotDoc.id, blocked: Boolean(data.blocked) }
}

function notifyNullProfile(onProfile, onError, error) {
  onProfile(null)
  if (onError && error) onError(error)
}

export function subscribeToUserProfile(user, onProfile, onError) {
  const emailKey = normalizeEmail(user?.email)
  if ((!user?.uid && !emailKey) || !db) {
    onProfile(null)
    return () => undefined
  }
  let unsubFallback = () => undefined
  const primaryId = user?.uid || emailKey

  const unsubPrimary = onSnapshot(
    doc(db, "usuarios", primaryId),
    (snapshot) => {
      unsubFallback()
      if (snapshot.exists()) return onProfile(mapSnapshotDoc(snapshot))
      if (!emailKey || emailKey === primaryId) return onProfile(null)
      unsubFallback = onSnapshot(
        doc(db, "usuarios", emailKey),
        (s) => onProfile(s.exists() ? mapSnapshotDoc(s) : null),
        (err) => notifyNullProfile(onProfile, onError, err),
      )
    },
    (err) => notifyNullProfile(onProfile, onError, err),
  )

  return () => { unsubPrimary(); unsubFallback() }
}

export function subscribeToAllUsers(onUsers, onError) {
  return onSnapshot(
    collection(db, "usuarios"),
    (snapshot) => onUsers(snapshot.docs.map(mapSnapshotDoc)),
    (error) => { if (onError) onError(error) },
  )
}

export async function updateUserRole(userId, newRole) {
  if (!userId) throw new Error("Se requiere UID del usuario")
  if (!Object.values(ROLES).includes(newRole)) throw new Error("Rol inválido")
  await updateDoc(doc(db, "usuarios", userId), { role: newRole, updatedAt: new Date().toISOString() })
}

export async function setUserBlockedStatus(userId, blocked) {
  if (!userId) throw new Error("Se requiere identificador del usuario")
  await updateDoc(doc(db, "usuarios", userId), { blocked: Boolean(blocked), updatedAt: new Date().toISOString() })
}

export async function authorizeUserEmail({ email, password, displayName = "", role = ROLES.EMPLEADO }) {
  const normalized = normalizeEmail(email)
  if (!normalized || !normalized.includes("@")) throw new Error("Se requiere un correo válido")
  if (!Object.values(ROLES).includes(role)) throw new Error("Rol inválido")

  const emailRef = doc(db, "usuarios", normalized)
  const existingEmailSnap = await getDoc(emailRef)
  if (existingEmailSnap.exists()) throw new Error("Ese correo ya se encuentra registrado en la base de datos")

  const createdUid = await createSecondaryAuthUser(normalized, password)
  const docId = createdUid || normalized
  const userRef = doc(db, "usuarios", docId)

  const now = new Date().toISOString()
  const profile = {
    id: docId,
    uid: docId,
    email: normalized,
    displayName: displayName.trim() || normalized.split("@")[0],
    role,
    blocked: false,
    createdAt: now,
    updatedAt: now,
  }
  await setDoc(userRef, profile)
  return profile
}
