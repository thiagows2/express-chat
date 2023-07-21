export default function Chat() {
  const messages = [
    {
      author: 'John Doe',
      message: 'Hello, how are you?'
    },
    {
      author: 'Jane Doe',
      message: 'I am fine, thanks!'
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col w-96 h-96 bg-white rounded-md shadow-md">
        <div className="flex flex-col flex-1 p-4 gap-4">
          {messages.map((message) => (
            <div
              key={message.message}
              className="flex flex-col items-start gap-1"
            >
              <span className="text-gray-500">{message.author}</span>
              <span className="text-black">{message.message}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-4">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 outline-none py-2 px-2 rounded-md text-white bg-black"
          />
          <button className="bg-black px-3 py-2 rounded-md hover:bg-gray-600 transition-all">
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
