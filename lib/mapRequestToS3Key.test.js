const mapRequestToS3Key = require('./mapRequestToS3Key');

describe('mapRequestToS3Key', ()=> {
  beforeEach(()=>{
    process.env.S3_BUCKET = 'the-specified-bucket-name';
  });

  it('uses the S3 bucket specified in env vars', ()=>{
    const event = {
      requestContext: {
        path: "/blah",
        domainPrefix:"blah"
      }
    };
    const result = mapRequestToS3Key(event);

    expect(result.bucket).toEqual('the-specified-bucket-name');
  });

  it('appends request path to the S3 url', ()=> {
    const event = {
      requestContext: {
        path: "/foo/bar/baz.html",
        domainPrefix: 'sub'
      }
    };
    const {key} = mapRequestToS3Key(event);

    expect(key).toEqual('sub/foo/bar/baz.html');
  });

  it('appends index.html if file component is missing, with no trailing slash', ()=> {
    const event = {
      requestContext: {
        path: "/foo/bar",
        domainPrefix: 'sub'
      }
    };
    const {key} = mapRequestToS3Key(event);

    expect(key).toEqual('sub/foo/bar/index.html');
  });

  it('correctly handles a naked request (subdomain w. empty path)', ()=> {
    const event = {
      requestContext: {
        path: "/",
        domainPrefix: 'sub'
      }
    };
    const {key} = mapRequestToS3Key(event);

    expect(key).toEqual('sub/index.html');
  });



});