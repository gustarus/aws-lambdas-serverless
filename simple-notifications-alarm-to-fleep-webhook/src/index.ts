import { SNSEvent } from 'aws-lambda';
import { TMessage } from './types';
import filter from './helpers/filter';
import prepare from './helpers/prepare';
import request from './helpers/request';
import { FLEEP_CHANNEL_HOOK_URL, FLEEP_MESSAGE_MARKERS, FLEEP_MESSAGE_SIGNATURE, FLEEP_MESSAGE_TEMPLATE } from './constants';

const url = require('url');

const hookUriParsed = url.parse(FLEEP_CHANNEL_HOOK_URL);
const hookUriProtocol = hookUriParsed.protocol.substring(0, hookUriParsed.protocol.length - 1);
const hookUriProcessor = require(hookUriProtocol);

export async function handler(event: SNSEvent) {
  const records = event && event.Records || [];
  const messages: TMessage[] = records.filter(filter).map(prepare).filter(Boolean);
  const promises = messages.map((message) => {
    const template = message.template || FLEEP_MESSAGE_TEMPLATE;
    const signature = message.signature || FLEEP_MESSAGE_SIGNATURE;
    const marker = FLEEP_MESSAGE_MARKERS[message.state];
    const content = template
      .replace(/\\n/g, '\n')
      .replace('${marker}', marker)
      .replace('${state}', message.state)
      .replace('${title}', message.title)
      .replace('${description}', message.description)
      .replace('${url}', message.url);
    const data = { message: content, user: signature };

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
