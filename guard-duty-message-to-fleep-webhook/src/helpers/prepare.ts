import { SNSEventRecord } from 'aws-lambda';
import { ACCEPTABLE_FINDING_TYPES } from '../constants';
import { TFinding, TMessage } from '../types';

export default function prepare(record: SNSEventRecord): TMessage[] {
  try {
    // try to parse message body and throw an error if not a json body
    const message: TFinding = JSON.parse(record.Sns.Message);

    // resolve message details to use inside the prepared record
    const type = message.type.toUpperCase().trim();
    const details = message.findingDetails;

    // validate message details that the message has required format
    if (!ACCEPTABLE_FINDING_TYPES.includes(type)) {
      return undefined;
    }

    // parse message amazon resource name to retrieve details
    return details.map((finding): TMessage => {
      const { link: findingLink, findingType, findingDescription } = finding;
      return { link: findingLink, type: findingType, description: findingDescription };
    });
  } catch (error) {
    return [];
  }
}
