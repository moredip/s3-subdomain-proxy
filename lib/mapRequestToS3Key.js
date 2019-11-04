const _path = require('path');

module.exports = function mapRequestToS3Key(event){
  const bucket = process.env.S3_BUCKET;

  const subdomain = event.requestContext.domainPrefix;

  const mungedPath = mungePath(event.requestContext.path);
  const key = subdomain + mungedPath;

  return { bucket, key };
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
  ]
  .join('/')
  .replace('//','/');
}