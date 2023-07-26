import { Server } from 'socket.io'

export default function SocketHandler(req: Request, res: any) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server, {
      path: '/socket.io',
      addTrailingSlash: false
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
      socket.on('new-message', (messageObject) => {
        io.emit('update-messages', messageObject)
      })
    })
  }

  res.end()
}
