const express = require('express')
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const PORT = 4000

app.use(cors())

const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`)
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected')
  })

  socket.on('new-message', (messageObject) => {
    io.emit('update-messages', messageObject)
  })
})

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
