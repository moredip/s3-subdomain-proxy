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

  const appearsToBeBinary = s3Response.ContentType.indexOf('image/') > -1;

  const encoding = appearsToBeBinary ? 'base64' : 'utf8';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': s3Response.ContentType,
    },
    isBase64Encoded: appearsToBeBinary,
    body: new Buffer(s3Response.Body).toString(encoding)
  };
};