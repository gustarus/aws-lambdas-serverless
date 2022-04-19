import * as url from 'url';
import * as uuid from 'uuid';
import * as Bunyan from 'bunyan';
import { Context } from 'aws-lambda';

const {
  AWS_LAMBDA_FUNCTION_NAME: functionName,
  LOG_LEVEL: logLevel = Bunyan.TRACE,
  TARGET_URL: targetUrl,
} = process.env;

let logger: Bunyan;

// implement aws lambda handler
export async function handler(event: any, context: Context) {
  // create logger if not created
  logger = logger || Bunyan.createLogger({
    name: `lambda.${functionName}`,
    level: <Bunyan.LogLevel>logLevel,
  });

  // create logger for the specified request
  const { awsRequestId: requestId = uuid.v4() } = context;
  const log = logger.child({ requestId }, true);
  log.info({ event, context }, 'run');

  // get target url details
  const targetParsed = url.parse(targetUrl.trim());
  const protocol = targetParsed.protocol.substring(0, targetParsed.protocol.length - 1);

  // require related protocol module
  const protocolModule = require(protocol);

  // send request from desired protocol module
  log.info(`Send request to url "${targetUrl.trim()}"`);
  await new Promise((resolve, reject) => {
    const request = protocolModule.request(targetParsed, (buffer) => {
      const status = buffer.statusCode
        ? parseInt(buffer.statusCode, 10) : undefined;
      if (status !== 200) {
        return reject(new Error(`Response returned invalid status code "${status}"`));
      }

      log.info('Server returned a valid status code');
    });

    request.on('error', reject);
    request.end();
  });
}
