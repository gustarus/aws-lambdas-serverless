// use url library to parse the url from the parameters
import * as url from 'url';

const {
  TARGET_URL: targetUrl,
} = process.env;

// implement aws lambda handler
exports.handler = function(event, context, callback) {
  // get target url details
  const targetParsed = url.parse(targetUrl.trim());
  const protocol = targetParsed.protocol.substring(0, targetParsed.protocol.length - 1);

  // require related protocol module
  const protocolModule = require(protocol);

  // send request from desired protocol module
  console.log('Check status of the "' + targetUrl.trim() + '"');
  const request = protocolModule.request(targetParsed, function(buffer) {
    buffer.setEncoding('utf8');

    buffer.on('data', function(chunk) {
      console.log('Read body chunk');
    });

    buffer.on('end', function() {
      console.log('Response end');
      callback();
    });
  });

  request.on('error', function(e) {
    console.error(e);
    callback(e);
  });

  request.end();
};
