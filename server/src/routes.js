const uuid = require('uuid')
const routes = require('express').Router()
const Message = require('./models/message.js')
const User = require('./models/user.js')

function mapMessageResponse(message, user) {
  return {
    id: message.id,
    text: message.text,
    created_at: message.created_at,
    user
  }
}

function getRandomColor() {
  const colors = [
    '#34B7F1',
    '#FF5733',
    '#9C27B0',
    '#00C851',
    '#FF1A75',
    '#FF1A1A',
    '#E040FB',
    '#4CAF50',
    '#FF6D00',
    '#FF4081',
    '#3F729B',
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

routes.post('/messages', async(req, res)=> {
  try {
    const user = await User.get(req.body.user_id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const message = await Message.create({
      id: uuid.v1(),
      text: req.body.text,
      user_id: req.body.user_id
    })
    const response = mapMessageResponse(message, user)

    return res.json(response)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

routes.get('/messages', async(req, res)=> {
  try {
    const messages = await Message.scan().exec()
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        const user = await User.get(message.user_id)
        return mapMessageResponse(message, user)
      }
    ))

    const sortedMessages = formattedMessages.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at)
    })
    res.json(sortedMessages)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

routes.post('/users', async(req, res)=> {
  const user = await User.create({
    id: uuid.v1(),
    name: req.body.name,
    color: getRandomColor()
  })

  return res.json(user)
})

routes.get('/users', async(req, res)=> {
  const users = await User.scan().exec()
  return res.json(users)
})

routes.get('/users/:id', async(req, res)=> {
  const user = await User.get(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  return res.json(user)
})

module.exports = routes
