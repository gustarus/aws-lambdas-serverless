import { SNSEventRecord } from 'aws-lambda';
import { TCouldWatchMessage, TInternalMessage, TMessage, TMessageState } from '../types';
import { MESSAGE_TYPE_INTERNAL } from '../constants';

const extractors = [
  (record: SNSEventRecord): TMessage => {
    // try to parse message body and throw an error if not a json body
    const message: TCouldWatchMessage = JSON.parse(record.Sns.Message);

    // resolve message details to use inside the prepared record
    const arn = message.AlarmArn;
    const state = message.NewStateValue.toLowerCase() as TMessageState;
    const title = message.AlarmName;
    const description = message.AlarmDescription || undefined;

    // validate message details that the message has required format
    if (!arn || !title) {
      throw new Error('Some required properties are empty when trying to parse alarm');
    }

    // parse message amazon resource name to retrieve details
    const [a, b, service, region, account, type, code] = arn.split(':');
    const url = `https://${region}.console.aws.amazon.com/${service}/home?region=${region}#s=Alarms&${type}=${!encodeURIComponent(code)}`;
    return { state, title, description, url };
  },

  (record: SNSEventRecord): TMessage => {
    // try to parse message body and throw an error if not a json body
    const message: TInternalMessage = JSON.parse(record.Sns.Message);

    // resolve message details to use inside the prepared record
    const type = message.type;
    const template = message.template;
    const signature = message.signature;
    const state = (message.state as string).toLowerCase() as TMessageState;
    const title = message.title || undefined;
    const description = message.description || undefined;
    const url = message.url || undefined;

    // check that the message has required type
    if (type !== MESSAGE_TYPE_INTERNAL) {
      throw new Error('This is not a custom message issues by the internal service');
    }

    // validate message details that the message has required format
    if (!title || !state) {
      throw new Error('Some required properties are empty when trying to parse custom alarm');
    }

    // parse message amazon resource name to retrieve details
    return { template, signature, state, title, description, url };
  },
];

export default function prepare(record: SNSEventRecord): TMessage | undefined {
  for (const extractor of extractors) {
    try {
      return extractor(record);
    } catch (error) {
    }
  }

  return undefined;
}
