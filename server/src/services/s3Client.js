const s3 = require('../s3.js')
const uuid = require('uuid')

async function uploadFile(encodedImage) {
  const fileExtension = encodedImage.split(';')[0].split('/')[1]
  const buffer = Buffer.from(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64')

  const params = {
    Bucket: process.env.AWS_S3_UPLOADS_BUCKET,
    Key: `${uuid.v1()}.${fileExtension}`,
    Body: buffer,
    ContentEncoding: 'base64',
    ACL: 'public-read'
  };

  const data = await s3.upload(params).promise();
  return data.Location;
}

async function getFileUrl(fileKey) {
  const params = {
    Bucket: process.env.AWS_S3_DEFAULTS_BUCKET,
    Key: fileKey
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) reject(err)
      else resolve(url)
    })
  })
}


module.exports = { uploadFile, getFileUrl }
