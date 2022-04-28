export const AWS_PROFILE = process.env.AWS_PROFILE;
export const AWS_REGION = process.env.AWS_REGION;

export const MESSAGE_STATE_INSUFFICIENT = 'insufficient';
export const MESSAGE_STATE_ALARM = 'alarm';
export const MESSAGE_STATE_OK = 'ok';

export const ALARM_URL_TEMPLATE = process.env.ALARM_URL_TEMPLATE;

export const TEAMS_CHANNEL_HOOK_URL = process.env.TEAMS_CHANNEL_HOOK_URL;
export const TEAMS_MESSAGE_TEMPLATE = process.env.TEAMS_MESSAGE_TEMPLATE;
export const TEAMS_MESSAGE_MARKERS = {
  [MESSAGE_STATE_INSUFFICIENT]: '⚠️',
  [MESSAGE_STATE_ALARM]: '🔥',
  [MESSAGE_STATE_OK]: '✅',
};
export const TEAMS_MESSAGE_COLORS = {
  [MESSAGE_STATE_INSUFFICIENT]: '#bfbfbf️',
  [MESSAGE_STATE_ALARM]: '#d63333',
  [MESSAGE_STATE_OK]: '#64a837',
};
