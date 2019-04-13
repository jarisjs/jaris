import { mimes } from '../constants';

const guessMime = (body: any) => {
  if (Array.isArray(body) || typeof body === 'object') {
    return mimes.JSON;
  }
  return mimes.TEXT;
};

const json = (body: any) => Buffer.from(JSON.stringify(body));
const text = (body: any) => Buffer.from(body);

const responseParser = (contentType: string, body: any) => {
  const mime = contentType || guessMime(body);
  switch (mime) {
    case mimes.JSON:
      return json(body);
    case mimes.TEXT:
    case mimes.HTML:
      return text(body);
    default:
      return body;
  }
};

export default responseParser;
