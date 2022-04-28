import axios from 'axios';
import { SNSEvent } from 'aws-lambda';
import { TMessage } from './types';
import filter from './helpers/filter';
import prepare from './helpers/prepare';
import { TEAMS_CHANNEL_HOOK_URL, TEAMS_MESSAGE_COLORS, TEAMS_MESSAGE_MARKERS, TEAMS_MESSAGE_TEMPLATE } from './constants';

const url = require('url');

export async function handler(event: SNSEvent) {
  const records = event && event.Records || [];
  const messages: TMessage[] = records.filter(filter).map(prepare).filter(Boolean);

  const promises = messages.map(async(message) => {
    const template = message.template || TEAMS_MESSAGE_TEMPLATE;
    const marker = TEAMS_MESSAGE_MARKERS[message.state];
    const color = TEAMS_MESSAGE_COLORS[message.state];
    const content = template
      .replace(/\\n/g, '\n')
      .replace(/\${marker}/g, marker)
      .replace(/\${state}/g, message.state)
      .replace(/\${title}/g, message.title)
      .replace(/\${description}/g, message.description)
      .replace(/\${url}/g, message.url);

    const data = {
      '@context': 'https://schema.org/extensions',
      '@type': 'MessageCard',
      'themeColor': color,
      'title': message.title,
      'text': content,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    console.log('Send message to the webhook', data, headers);
    return await axios.post(TEAMS_CHANNEL_HOOK_URL, data, { headers });
  });

  return Promise.all(promises);
}
