'use client'

import { io } from 'socket.io-client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, UserType } from '@/contexts/UserContext'
import { configAxios } from '@/utils/configAxios'
import useAxios from 'axios-hooks'
import { Spinner } from '@/components/Spinner'

const socket = io('https://apichat.thiagows.dev')

type MessageType = {
  id: string
  user: UserType
  text: string
  created_at: string
}

export default function Home() {
  configAxios()
  const inputRef = useRef<HTMLInputElement>(null)
  const lastUserIdRef = useRef<string | null>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)

  const { currentUser } = useContext(UserContext)

  const [{ loading: loadingMessages, error, data }] = useAxios({
    url: '/messages'
  })

  const [, createMessage] = useAxios(
    {
      url: '/messages',
      method: 'POST'
    },
    { manual: true }
  )

  useEffect(() => {
    initializeSocket()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (data) {
      setMessages(data)
    }
  }, [data])

  function initializeSocket() {
    socket.on('update-messages', (message: MessageType) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on('show-typing', (userName: string) => {
      setTypingUser(userName)

      setTimeout(() => {
        setTypingUser(null)
      }, 2000)
    })
  }

  function emitTyping() {
    socket.emit('typing', currentUser.name)
  }

  function scrollToBottom() {
    const messagesDiv = document.getElementById('messages')
    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight)
  }

  async function onSend() {
    if (!inputRef.current?.value) return

    setLoading(true)

    try {
      const { data: messageData } = await createMessage({
        data: {
          user_id: currentUser.id,
          text: inputRef.current.value
        }
      })

      socket.emit('new-message', messageData)
      inputRef.current.value = ''
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function onEnter({ key }: { key: string }) {
    if (key === 'Enter') {
      onSend()
    }
  }

  if (!currentUser) {
    return <Spinner />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-red-500 text-xl">{error.message}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8">
      <div className="flex flex-col min-w-[320px] max-w-[460px] w-full h-[520px] bg-white rounded-md shadow-md">
        <div
          id="messages"
          className="flex flex-col flex-1 py-4 pl-8 pr-4 gap-0.5 overflow-y-auto"
        >
          {typingUser && (
            <span className="text-gray-400 text-sm self-center absolute">
              {typingUser} está digitando...
            </span>
          )}
          {messages.map((message) => {
            const isCurrentUser = currentUser.id === message.user.id
            const showName =
              !isCurrentUser && message.user.id !== lastUserIdRef.current

            lastUserIdRef.current = message.user.id

            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  isCurrentUser ? 'items-end' : 'items-start'
                }`}
              >
                {showName ? (
                  <div className="px-4 py-2 rounded-lg bg-gray-200 flex flex-col mt-2 relative max-w-[75%]">
                    {!isCurrentUser && (
                      <img
                        src={message.user.avatar}
                        alt="user-avatar"
                        className="w-6 h-6 rounded-full absolute top-0 left-[-26px] bg-gray-200"
                      />
                    )}
                    <span
                      className="font-bold text-sm"
                      style={{ color: message.user.color }}
                    >
                      {message.user.name}
                    </span>
                    <span className="text-gray-800 text-sm break-words">
                      {message.text}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-lg text-sm break-words max-w-[75%] text-gray-800 ${
                      isCurrentUser ? 'bg-green-200' : 'bg-gray-200'
                    }`}
                  >
                    {message.text}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Envie uma mensagem"
            className="flex-1 outline-none py-2 px-2 rounded-md text-white bg-black"
            onKeyDown={onEnter}
            onChange={emitTyping}
            autoFocus
          />
          <button
            className="bg-black px-3 py-2 rounded-md hover:bg-gray-600 transition-all w-20"
            onClick={onSend}
          >
            {loading || loadingMessages ? (
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
