export const ACCEPTABLE_FINDING_TYPES = ['NEW_FINDINGS'];

export const AWS_PROFILE = process.env.AWS_PROFILE;
export const AWS_REGION = process.env.AWS_REGION;

export const MESSAGE_TYPE_INTERNAL = 'Message::Notification';

export const MESSAGE_STATE_INSUFFICIENT = 'insufficient';
export const MESSAGE_STATE_ALARM = 'alarm';
export const MESSAGE_STATE_OK = 'ok';

export const FLEEP_CHANNEL_HOOK_URI = process.env.FLEEP_CHANNEL_HOOK_URI;
export const FLEEP_MESSAGE_SIGNATURE = process.env.FLEEP_MESSAGE_SIGNATURE || 'Signature';
export const FLEEP_MESSAGE_TEMPLATE = process.env.FLEEP_MESSAGE_TEMPLATE || 'Message template';
export const FLEEP_MESSAGE_MARKERS = {
  [MESSAGE_STATE_INSUFFICIENT]: '⚠️',
  [MESSAGE_STATE_ALARM]: '🔥',
  [MESSAGE_STATE_OK]: '✅',
};
