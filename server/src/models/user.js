const dynamoose = require('dynamoose')

dynamoose.aws.ddb.local()

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
  }
})

module.exports = dynamoose.model('User', userSchema)
