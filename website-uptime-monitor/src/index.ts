import axios from 'axios';
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

  // send request from desired protocol module
  log.info(`Send request to url "${targetUrl.trim()}"`);

  const response = await axios.get(targetUrl);
  if (response.status !== 200) {
    throw new Error(`Response returned invalid status code "${status}"`);
  }
}
