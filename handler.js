const AWS = require('aws-sdk');

const mapRequestToS3Key = require('./lib/mapRequestToS3Key');

const s3 = new AWS.S3();

// partially based on https://gist.github.com/kingkool68/26aa7a3641a3851dc70ce7f44f589350
module.exports.proxy = event => {
  const {key,bucket} = mapRequestToS3Key(event);

  console.log('fetching content: s3://%s/%s',bucket,key);

  return s3.makeUnauthenticatedRequest(
    'getObject',
    {
      Bucket: bucket,
      Key: key,
    }
  ).promise()
  .then(responseFromS3Success)
  .catch(responseFromS3Error);
};

function responseFromS3Success(response){
  // we just treat everything as a binary media type, rather than trying to decide which
  // stuff from S3 is which based on `content-type`.
  return {
    statusCode: 200,
    headers: {
      'Content-Type': response.ContentType,
    },
    isBase64Encoded: true,
    body: response.Body.toString('base64')
  };
}

function responseFromS3Error(error){
  if( error.code === 'NoSuchKey' ){
    return {
      statusCode: 404,
      body: '404 Not Found'
    };
  }

  const body = {
    code: error.code,
    message: error.message,
  };

  return {
    statusCode: 504,
    body: JSON.stringify(body,null,2)
  };
}