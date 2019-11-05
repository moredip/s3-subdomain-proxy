const handler = require('./handler');

describe('[INTEGRATION] proxy handler', ()=>{
  beforeEach(()=>{
    // A real known-good bucket for integration testing
    process.env.S3_BUCKET = 'a-bucket-for-testing'; 
  });

  it('returns html content', async ()=> {
    const inputEvent = {
      requestContext: {
        path: '/sub/example-file.html',
        domainPrefix: 'sub'
      }
    };

    const outputEvent = await handler.proxy(inputEvent);

    expect(outputEvent).toHaveProperty('statusCode',200);
  });

  it('returns a 404 for a bad path', async ()=> {
    const inputEvent = {
      requestContext: {
        path: '/not-a-valid-path',
        domainPrefix: 'sub'
      }
    };

    const outputEvent = await handler.proxy(inputEvent);

    expect(outputEvent).toHaveProperty('statusCode',404);
  });

});