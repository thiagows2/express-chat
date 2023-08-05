const dynamoose = require('dynamoose')
const uuid = require('uuid')

dynamoose.aws.ddb.local()

const messageSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuid.v1()
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
    type: String,
    default: Date.now()
  }
})

module.exports = dynamoose.model('Message', messageSchema)
