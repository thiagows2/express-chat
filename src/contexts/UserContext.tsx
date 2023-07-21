'use client'

import { createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type UserContextType = {
  currentUser: string | null
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: any) {
  const user = localStorage.getItem('user-name')
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/chat')
    } else {
      router.push('/')
    }
  }, [router, user])

  return (
    <UserContext.Provider value={{ currentUser: user }}>
      {children}
    </UserContext.Provider>
  )
}
