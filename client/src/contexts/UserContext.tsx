'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Spinner } from '@/components/Spinner'
import useAxios from 'axios-hooks'

export type UserType = {
  id: string
  name: string
}

type UserContextType = {
  currentUser: UserType
  setCurrentUser: (id: string) => void
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: any) {
  const [loading, setLoading] = useState(true)
  const isBrowser = typeof window !== 'undefined'
  const [user, setUser] = useState<UserType | null>(null)
  const userId = isBrowser ? localStorage.getItem('current-user-id') : null
  const router = useRouter()
  const pathname = usePathname()

  const [{ loading: loadingUser }, fetchUser] = useAxios(
    {
      url: `http://localhost:4000/users/${userId}`
    },
    { manual: true }
  )

  const handleSetUser = useCallback(async () => {
    if (user && pathname === '/chat') return
    if (!userId) return router.push('/')
    if (user) return router.push('/chat')

    const { data } = await fetchUser()
    if (data) {
      setUser(data)
      await router.push('/chat')
    }
  }, [user, pathname, userId, router, fetchUser])

  useEffect(() => {
    handleSetUser()

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [handleSetUser])

  function setCurrentUser(id: string) {
    if (isBrowser) {
      localStorage.setItem('current-user-id', id)
    }
  }

  if (loading || loadingUser) {
    return <Spinner />
  }

  return (
    // @ts-ignore
    <UserContext.Provider value={{ currentUser: user, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}
