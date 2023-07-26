'use client'

import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'

type UserContextType = {
  currentUser: string | null
  setUser: (name: string) => void
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: any) {
  const [loading, setLoading] = useState(true)
  const isBrowser = typeof window !== 'undefined'
  const user = isBrowser ? localStorage.getItem('user-name') : null
  const router = useRouter()

  useEffect(() => {
    handleSetMounted()

    if (user) {
      router.replace('/chat')
    } else {
      router.replace('/')
    }
  }, [router, user])

  function handleSetMounted() {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  function setUser(name: string) {
    if (isBrowser) {
      localStorage.setItem('user-name', name)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <UserContext.Provider value={{ currentUser: user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
