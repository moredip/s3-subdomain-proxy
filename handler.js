const AWS = require('aws-sdk');

const mapRequestToS3Key = require('./lib/mapRequestToS3Key');

const s3 = new AWS.S3();

// partially based on https://gist.github.com/kingkool68/26aa7a3641a3851dc70ce7f44f589350
module.exports.hello = async event => {
  const {key,bucket} = mapRequestToS3Key(event);

  const s3Response = await s3.makeUnauthenticatedRequest(
    'getObject',
    {
      Bucket: bucket,
      Key: key,
    }
  ).promise();

  // we just treat everything as a binary media type, rather than trying to decide which
  // stuff from S3 is which based on `content-type`.
  return {
    statusCode: 200,
    headers: {
      'Content-Type': s3Response.ContentType,
    },
    isBase64Encoded: true,
    body: s3Response.Body.toString('base64')
  };
};