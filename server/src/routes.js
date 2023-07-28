const routes = require('express').Router()
const Message = require('./models/message.js');

routes.post('/api/messages', async(req, res)=>{
  const message = await Message.create(req.body)
  return res.json(message)
})

routes.get('/api/messages', async(req, res)=>{
  const messages = await Message.scan().exec()
  return res.json(messages)
})

module.exports = routes
