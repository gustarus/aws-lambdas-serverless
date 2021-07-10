import { MESSAGE_STATE_ALARM, MESSAGE_TYPE_INTERNAL, MESSAGE_STATE_INSUFFICIENT, MESSAGE_STATE_OK } from './constants';

export type TMessageState =
  | typeof MESSAGE_STATE_INSUFFICIENT
  | typeof MESSAGE_STATE_ALARM
  | typeof MESSAGE_STATE_OK;

export type TCouldWatchMessage = {
  AlarmArn: string;
  AlarmName: string;
  AlarmDescription: string;
  NewStateValue: string;
}

export type TInternalMessage = {
  type: typeof MESSAGE_TYPE_INTERNAL;
  template?: string;
  signature?: string;
  state: TMessageState;
  title: string;
  description?: string;
  url?: string;
}

export type TMessage = {
  template?: string;
  signature?: string;
  state: TMessageState;
  title: string;
  description: string;
  url: string;
}
