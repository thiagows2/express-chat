'use client'

import io from 'Socket.IO-client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, UserType } from '@/contexts/UserContext'
import useAxios from 'axios-hooks'

const socket = io('http://localhost:4000')

type MessageType = {
  id: string
  user: UserType
  text: string
  created_at: string
}

export default function Chat() {
  const inputRef = useRef<HTMLInputElement>(null)
  const lastUserIdRef = useRef<string | null>(null)

  const { currentUser } = useContext(UserContext)

  const [messages, setMessages] = useState<MessageType[]>([])

  const [{ data }] = useAxios({
    url: 'http://localhost:4000/messages'
  })

  const [, createMessage] = useAxios(
    {
      url: 'http://localhost:4000/messages',
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
  }

  function scrollToBottom() {
    const messagesDiv = document.getElementById('messages')
    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight)
  }

  async function onSend() {
    if (!inputRef.current?.value) return

    const { data: messageData } = await createMessage({
      data: {
        user_id: currentUser.id,
        text: inputRef.current.value
      }
    })

    socket.emit('new-message', messageData)
    inputRef.current.value = ''
    scrollToBottom()
  }

  function onEnter({ key }: { key: string }) {
    if (key === 'Enter') {
      onSend()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col w-96 h-96 bg-white rounded-md shadow-md">
        <div
          id="messages"
          className="flex flex-col flex-1 p-4 gap-0.5 overflow-y-auto"
        >
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
                {showName && (
                  <span className="text-gray-500">{message.user.name}</span>
                )}
                <span
                  className={`px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </span>
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
          />
          <button
            className="bg-black px-3 py-2 rounded-md hover:bg-gray-600 transition-all"
            onClick={onSend}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}