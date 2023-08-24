const dynamoose = require('dynamoose')
const ddb = require('../dynamodb')

dynamoose.aws.ddb.set(ddb)

const userSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  }
})

module.exports = dynamoose.model('User', userSchema)
