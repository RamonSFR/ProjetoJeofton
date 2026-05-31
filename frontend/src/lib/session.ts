import type { UserRecord } from '../types/api'
import type { UserRole } from '../types/api'

const SESSION_KEY = 'ifome-session'

export interface SessionUser extends UserRecord {
  role: UserRole
}

export const getStoredSession = (): SessionUser | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as SessionUser
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export const saveSession = (user: UserRecord, role: UserRole) => {
  const session = { ...user, role }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('storage'))
}

export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('storage'))
}
