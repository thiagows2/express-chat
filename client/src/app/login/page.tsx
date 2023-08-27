'use client'

import { UserContext } from '@/contexts/UserContext'
import { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { configAxios } from '@/utils/configAxios'
import AvatarModal from '@/components/AvatarModal'
import useAxios from 'axios-hooks'
import { IoMdCamera } from 'react-icons/io'

export default function Login() {
  configAxios()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const userRef = useRef<HTMLInputElement>(null)
  const { setCurrentUser } = useContext(UserContext)
  const router = useRouter()

  const [, createUser] = useAxios(
    {
      url: '/users',
      method: 'POST'
    },
    { manual: true }
  )

  function redirectToChat() {
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  function onEnterPress({ key }: { key: string }) {
    if (key === 'Enter') {
      onContinue()
    }
  }

  function openAvatarModal() {
    setIsModalOpen(true)
  }

  function closeAvatarModal() {
    setIsModalOpen(false)
  }

  function handleAvatarSelect(avatar: string, isUploading: boolean) {
    setIsUploading(isUploading)
    setSelectedAvatar(avatar)
  }

  async function onContinue() {
    const userName = userRef.current?.value || ''
    if (!userName) return

    try {
      setLoading(true)

      const response = await createUser({
        data: {
          name: userName,
          avatar: selectedAvatar || 'default.png'
        }
      })

      setCurrentUser(response.data.id)
      redirectToChat()
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <main className="flex items-center p-4 mx-auto min-h-screen justify-center ">
      <AvatarModal
        isOpen={isModalOpen}
        onClose={closeAvatarModal}
        onSelect={handleAvatarSelect}
      />
      <div className="flex flex-col w-60 gap-4 items-center">
        <div
          className={`relative w-24 h-24 mb-4 cursor-pointer ${
            selectedAvatar && 'flex items-center justify-center mb-0'
          }`}
          onClick={openAvatarModal}
        >
          {selectedAvatar ? (
            <img
              className="rounded-full cursor-pointer"
              src={isUploading ? selectedAvatar : `/avatars/${selectedAvatar}`}
              alt="Avatar"
            />
          ) : (
            <>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center absolute border-2 border-[#3D3E51] right-[-4px]">
                <IoMdCamera />
              </div>
              <img
                className="rounded-full cursor-pointer"
                src="/avatars/default.png"
                alt="Avatar"
              />
            </>
          )}
        </div>
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
