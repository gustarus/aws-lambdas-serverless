import * as http from 'http';
import * as https from 'https';
import { RequestOptions } from 'http';

export default function request(processor: typeof http | typeof https, options: RequestOptions = {}, body = undefined) {
  return new Promise((resolve, reject) => {
    // create request instance
    const request = processor.request(options, (response) => {
      let data = '';

      // a chunk of data has been recieved.
      response.on('data', (chunk) => {
        data += chunk;
      });

      // the whole response has been received
      response.on('end', () => resolve(JSON.parse(data)));
    });

    // listen to request errors
    request.on('error', (error) => reject(error));

    // write data if exists and close the reuqest
    body && request.write(body);
    request.end();
  });
}
