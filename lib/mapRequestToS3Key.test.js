const mapRequestToS3Key = require('./mapRequestToS3Key');

describe('mapRequestToS3Key', ()=> {
  beforeEach(()=>{
    process.env.S3_BUCKET = 'the-specified-bucket-name';
  });

  it('uses the S3 bucket specified in env vars', ()=>{
    const event = {
      path: "/blah"
    };
    const result = mapRequestToS3Key(event);

    expect(result).toEqual('s3://the-specified-bucket-name/blah/index.html');
  });

  it('appends request path to the S3 url', ()=> {
    const event = {
      path: "/foo/bar/baz.html"
    };
    const result = mapRequestToS3Key(event);

    expect(result).toEqual('s3://the-specified-bucket-name/foo/bar/baz.html');
  });

  it('appends index.html if file component is missing, with no trailing slash', ()=> {
    const event = {
      path: "/foo/bar"
    };
    const result = mapRequestToS3Key(event);

    expect(result).toEqual('s3://the-specified-bucket-name/foo/bar/index.html');

  });
});