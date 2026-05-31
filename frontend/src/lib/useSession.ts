import { useEffect, useState } from 'react'

import { getStoredSession, type SessionUser } from './session'

export const useSession = () => {
  const [session, setSession] = useState<SessionUser | null>(() =>
    getStoredSession()
  )

  useEffect(() => {
    const syncSession = () => setSession(getStoredSession())

    window.addEventListener('storage', syncSession)

    return () => window.removeEventListener('storage', syncSession)
  }, [])

  return session
}
