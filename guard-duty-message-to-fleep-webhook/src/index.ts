import * as url from 'url';
import * as http from 'http';
import * as https from 'https';
import request from './helpers/request';
import { AWS_GUARD_DUTY_URL, AWS_PROFILE, AWS_REGION, FLEEP_CHANNEL_HOOK_URI, FLEEP_MESSAGE_SIGNATURE, FLEEP_MESSAGE_TEMPLATE } from './constants';
import filter from './helpers/filter';
import prepare from './helpers/prepare';
import { SNSEvent, SNSEventRecord } from 'aws-lambda';
import { TMessage } from './types';

const protocols = { http, https };
const hookUriParsed = url.parse(FLEEP_CHANNEL_HOOK_URI);
const hookUriProtocol = hookUriParsed.protocol.substring(0, hookUriParsed.protocol.length - 1).trim().toLowerCase();
const hookUriProcessor = protocols[hookUriProtocol];

export async function handler(event: SNSEvent) {
  const records = event && event.Records || [];
  const messages: TMessage[] = records.filter(filter).reduce((stack, record: SNSEventRecord) => {
    return [...stack, ...prepare(record)];
  }, []);

  const promises = messages.map((message: TMessage) => {
    const content = FLEEP_MESSAGE_TEMPLATE
      .replace(/\\n/g, '\n')
      .replace(/\${type}/g, message.type)
      .replace(/\${description}/g, message.description)
      .replace(/\${urlToDocs}/g, message.link)
      .replace(/\${urlToService}/g, AWS_GUARD_DUTY_URL);
    const data = { message: content, user: FLEEP_MESSAGE_SIGNATURE };

    const options = {
      method: 'POST',
      protocol: hookUriParsed.protocol,
      hostname: hookUriParsed.hostname,
      path: hookUriParsed.path,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    console.log('Send message to the webhook', options, data);
    return request(hookUriProcessor, options, JSON.stringify(data));
  });

  return Promise.all(promises);
}
