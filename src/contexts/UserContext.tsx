'use client'

import { createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type UserContextType = {
  currentUser: string | null
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: any) {
  const isBrowser = typeof window !== 'undefined'
  const user = isBrowser ? localStorage.getItem('user-name') : null
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/chat')
    }
  }, [router, user])

  return (
    <UserContext.Provider value={{ currentUser: user }}>
      {children}
    </UserContext.Provider>
  )
}
