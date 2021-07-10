import { SNSEventRecord } from 'aws-lambda';

export default function filter(record: SNSEventRecord): boolean {
  if (record.EventSource.toLowerCase() !== 'aws:sns') {
    return false;
  }

  if (!record.Sns || record.Sns.Type !== 'Notification') {
    return false;
  }

  return true;
}
