'use client'

import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Spinner } from '@/components/Spinner'
import useAxios from 'axios-hooks'
import { configAxios } from '@/utils/configAxios'

export type UserType = {
  id: string
  name: string
  color: string
  avatar: string
}

type UserContextType = {
  currentUser: UserType
  setCurrentUser: (id: string) => void
}

export const UserContext = createContext({} as UserContextType)

export function UserProvider({ children }: any) {
  configAxios()
  const [loading, setLoading] = useState(true)
  const isBrowser = typeof window !== 'undefined'
  const [user, setUser] = useState<UserType | null>(null)
  const userId = isBrowser ? localStorage.getItem('current-user-id') : null
  const router = useRouter()
  const pathname = usePathname()

  const [{ loading: loadingUser }, fetchUser] = useAxios(
    {
      url: `/users/${userId}`
    },
    { manual: true }
  )

  const handleSetUser = useCallback(async () => {
    if (user && pathname === '/') return
    if (user) return router.push('/')
    if (!userId) return router.push('/login')

    try {
      const { data } = await fetchUser()

      setUser(data)
      await router.push('/')
    } catch (error) {
      console.log(error)
      await router.push('/login')
    }
  }, [user, pathname, router, userId, fetchUser])

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
