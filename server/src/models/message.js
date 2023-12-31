const dynamoose = require('dynamoose')
const ddb = require('../dynamodb')

dynamoose.aws.ddb.set(ddb)

const messageSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = dynamoose.model('Message', messageSchema)
