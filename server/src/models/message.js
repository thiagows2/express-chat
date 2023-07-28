const dynamoose = require('dynamoose')
const uuid = require('uuid')

dynamoose.aws.ddb.local()

const messageSchema = new dynamoose.Schema({
    id: {
      type: String,
      hashKey: true,
      default: uuid.v1()
    },
    user: {
      type: String
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  })

module.exports = dynamoose.model('Message', messageSchema)
