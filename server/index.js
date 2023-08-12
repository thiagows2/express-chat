require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./src/routes')
const app = express()
const server = require('http').Server(app)
const SERVER_PORT = 4000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(routes)

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://chat.thiagows.dev']
  }
})

io.on('connection', (socket) => {
  socket.on('new-message', (messageObject) => {
    io.emit('update-messages', messageObject)
  })

  socket.on('typing', (userName) => {
    socket.broadcast.emit('show-typing', userName)
  })
})

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on ${SERVER_PORT}`)
})
