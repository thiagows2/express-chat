const routes = require('express').Router()
const Message = require('./models/message.js')
const User = require('./models/user.js')

routes.post('/messages', async(req, res)=> {
  try {
    const user = await User.get(req.body.user_id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const message = await Message.create(req.body)

    return res.json({ ...message, user })
  } catch (error) {
    console.error('Error saving message:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.get('/messages', async(req, res)=> {
  try {
    const messages = await Message.scan().exec()
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        const user = await User.get(message.user_id)

        return { ...message, user }
      })
    )

    res.json(formattedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

routes.post('/users', async(req, res)=> {
  const user = await User.create(req.body)
  return res.json(user)
})

routes.get('/users', async(req, res)=> {
  const users = await User.scan().exec()
  return res.json(users)
})

routes.get('/users/:id', async(req, res)=> {
  const user = await User.get(req.params.id)
  return res.json(user)
})

module.exports = routes
