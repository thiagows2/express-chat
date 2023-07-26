'use client'

import { UserContext } from '@/contexts/UserContext'
import { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const userRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(UserContext)
  const router = useRouter()

  function redirect() {
    setTimeout(() => {
      setLoading(false)
      router.push('/chat')
    }, 1000)
  }

  function onEnterPress({ key }: { key: string }) {
    if (key === 'Enter') {
      onContinue()
    }
  }

  function onContinue() {
    const userName = userRef.current?.value || ''
    if (!userName) return

    setUser(userName)
    setLoading(true)
    redirect()
  }

  return (
    <main className="flex items-center p-4 mx-auto min-h-screen justify-center ">
      <div className="flex flex-col w-60 gap-4 items-center">
        <input
          ref={userRef}
          type="text"
          placeholder="Digite seu nome"
          className="outline-none py-2 px-2 rounded-md text-white bg-black w-full"
          onKeyDown={onEnterPress}
        />
        <button
          className="bg-black px-3 py-2 rounded-md w-full hover:bg-gray-600 transition-all"
          onClick={onContinue}
        >
          {loading ? (
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
          ) : (
            'Continuar'
          )}
        </button>
      </div>
    </main>
  )
}
