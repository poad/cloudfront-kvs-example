// @ts-ignore
import cf from 'cloudfront';

const kvsId = '{{ kvsID }}';

interface CroudFrontRequest {
  uri: string;
}

interface CloudFrontRequestEvent {
  request: CroudFrontRequest;
}

const kvsHandle = cf.kvs(kvsId);

async function handler(event: CloudFrontRequestEvent) {
  const request = event.request;
  const pathSegments = request.uri.split('/')
  const key = pathSegments[1]
  try {
      // Replace the first path of the pathname with the value of the key
      // For example http(s)://domain/<value>/something/else
      pathSegments[1] = await kvsHandle.get(key);
      const newUri = pathSegments.join('/');
      console.log(`${request.uri} -> ${newUri}`)
      request.uri = newUri;
  } catch (err) {
    const uri = request.uri;

    // Check whether the URI is missing a file name.
    if (uri.endsWith('/')) {
      request.uri += 'index.html';
    }
    // Check whether the URI is missing a file extension.
    else if (!uri.includes('.')) {
      request.uri += '/index.html';
    }
  }
  return request;
}
