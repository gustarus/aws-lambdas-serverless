export const ACCEPTABLE_FINDING_TYPES = ['NEW_FINDINGS'];

export const AWS_PROFILE = process.env.AWS_PROFILE;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_GUARD_DUTY_URL = `https://${AWS_REGION}.console.aws.amazon.com/guardduty/home?region=${AWS_REGION}#/findings?macros=current`;

export const FLEEP_CHANNEL_HOOK_URI = process.env.FLEEP_CHANNEL_HOOK_URI;
export const FLEEP_MESSAGE_SIGNATURE = process.env.FLEEP_MESSAGE_SIGNATURE || 'Signature';
export const FLEEP_MESSAGE_TEMPLATE = process.env.FLEEP_MESSAGE_TEMPLATE || 'Message template';
