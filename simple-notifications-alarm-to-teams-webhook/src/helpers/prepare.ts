import { SNSEventRecord } from 'aws-lambda';
import { TCouldWatchMessage, TMessage, TMessageState } from '../types';
import { ALARM_URL_TEMPLATE } from '../constants';

export default function prepare(record: SNSEventRecord): TMessage | undefined {
  let message: TCouldWatchMessage;
  try {
    // try to parse message body
    // throw an error if not a json body
    message = JSON.parse(record.Sns.Message);
  } catch (error) {
    throw new Error('The message field should be a valid aws alert json content');
  }


  // resolve message details to use inside the prepared record
  const arn = message.AlarmArn;
  const state = message.NewStateValue.toLowerCase() as TMessageState;
  const title = message.AlarmName;
  const description = message.AlarmDescription || undefined;

  if (!arn) {
    throw new Error('There is no alarm arn provided in the message content');
  }

  if (!state) {
    throw new Error('There is no alarm state provided in the message content');
  }

  if (!title) {
    throw new Error('There is no alarm title provided in the message content');
  }


  // parse message amazon resource name to retrieve details
  const [a, b, service, region, account, type, code] = arn.split(':');

  // compile a link to the aws alarm
  const url = ALARM_URL_TEMPLATE
    .replace(/\${service}/g, service)
    .replace(/\${region}/g, region)
    .replace(/\${account}/g, account)
    .replace(/\${type}/g, encodeURIComponent(code))
    .replace(/\${code}/g, encodeURIComponent(code));

  return { state, title, description, url };
}
