require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const routes = require('./src/routes')
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(routes)

const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://chat.thiagows.dev'],
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

server.listen(4040, () => {
  console.log('Server running on port 4040')
})
