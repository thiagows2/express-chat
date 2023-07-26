'use client'

import io from 'Socket.IO-client'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '@/contexts/UserContext'
let socket: any

type Message = {
  user: string
  message: string
}

export default function Chat() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { currentUser } = useContext(UserContext)

  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socketInitializer()
  }, [])

  async function socketInitializer() {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-messages', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })
  }

  function scrollToBottom() {
    const messagesDiv = document.getElementById('messages')
    messagesDiv?.scrollTo(0, messagesDiv.scrollHeight)
  }

  function onSend() {
    if (!inputRef.current?.value) return

    socket.emit('new-message', {
      user: currentUser,
      message: inputRef.current.value
    })

    scrollToBottom()
    inputRef.current.value = ''
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
          className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto"
        >
          {messages.map((message) => (
            <div key={message.message} className="flex flex-col items-start">
              <span className="text-gray-500">{message.user}</span>
              <span className="text-black">{message.message}</span>
            </div>
          ))}
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
