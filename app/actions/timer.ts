import { Action } from 'redux';
import moment from 'moment';
import { ipcRenderer } from 'electron';

export const START_TIMER = 'TIMER/START';
export interface StartAction extends Action<typeof START_TIMER> {
  payload: string;
}
export const CANCEL_TIMER = 'TIMER/CANCEL';
export type CancelAction = Action<typeof CANCEL_TIMER>;

type StartActionCreator = (length: number) => StartAction;
export const start: StartActionCreator = length => {
  const timer = moment()
    .add(length, 'm')
    .toString();
  ipcRenderer.send('timer-started');

  return {
    type: START_TIMER,
    payload: timer
  };
};

export function cancel(): CancelAction {
  ipcRenderer.send('timer-stopped');

  return {
    type: CANCEL_TIMER
  };
}
