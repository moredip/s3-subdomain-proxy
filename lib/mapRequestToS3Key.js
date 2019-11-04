const _path = require('path');

module.exports = function mapRequestToS3Key(event){
  const bucketName = process.env.S3_BUCKET;

  const mungedPath = mungePath(event.path);

  return `s3://${bucketName}${mungedPath}`
}

function mungePath(path){
  const parsedPath = _path.parse(path);
  if( parsedPath.ext !== '' ){
    // the path already appears to contain a filename component, no munging required
    return path;
  }

  // handle a special-case that would trip up the upcoming `/` join 
  if(parsedPath.dir === '/'){
    parsedPath.dir = ''
  }

  return [
    parsedPath.dir,
    parsedPath.name,
    'index.html'
  ].join('/');
}