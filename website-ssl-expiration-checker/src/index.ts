import sslChecker from 'ssl-checker';
import * as uuid from 'uuid';
import * as Bunyan from 'bunyan';
import { Context } from 'aws-lambda';

const {
  AWS_LAMBDA_FUNCTION_NAME: functionName,
  LOG_LEVEL: logLevel = Bunyan.TRACE,
  TARGET_DOMAINS: targetDomains,
  EXPIRATION_THRESHOLD: expirationThreshold,
} = process.env;

let logger: Bunyan;

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

  // parse target domains and clean it up
  const targetDomainsSplit = targetDomains.split(',')
    .map((targetDomain => targetDomain.trim()));

  // loop through all domains
  log.info(`Begin ssl checking for the domain certificates`);
  for (const targetDomain of targetDomainsSplit) {
    // resolve target host ssl details
    log.info(`Perform target domain ssl check for the '${targetDomain}'`);
    const details = await sslChecker(targetDomain);

    // check that ssl certificate is still valid
    if (!details.valid) {
      throw new Error(`Target domain '${targetDomain}' ssl certificate is not valid`);
    }

    // check that ssl certificate is not about to expire
    if (details.daysRemaining <= parseInt(expirationThreshold, 10) / 60 / 60 / 24) {
      throw new Error(`Target domain '${targetDomain}' ssl certificate is about to expire: ${details.daysRemaining} days left`);
    }
  }
}
