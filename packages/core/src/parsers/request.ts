import { IncomingMessage } from 'http';
import { mimes } from '../constants';

const handleChunks = (contentType: string, chunks: string) => {
  switch (contentType) {
    case mimes.JSON:
      return JSON.parse(chunks);
    default:
      return chunks;
  }
};

const requestParser = (req: IncomingMessage) => {
  return new Promise(resolve => {
    const { method, headers } = req;
    if (!method || !(method.toLowerCase() in ['post', 'put', 'patch'])) {
      resolve({});
      return;
    }
    let chunks = '';
    req.on('data', chunk => {
      chunks += chunk.toString();
    });
    req.on('end', () => {
      resolve(handleChunks(headers['content-type'] || '', chunks));
    });
  });
};

export default requestParser;
