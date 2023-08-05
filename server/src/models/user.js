const dynamoose = require('dynamoose')
const uuid = require('uuid')

dynamoose.aws.ddb.local()

const userSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuid.v1()
  },
  name: {
    type: String,
    required: true
  }
})

module.exports = dynamoose.model('User', userSchema)
