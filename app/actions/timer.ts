import { Action } from 'redux';
import moment, { Moment } from 'moment';
import { ipcRenderer } from 'electron';
import { saveToLocalStorage } from '../utils/storageUtils';

export const START_TIMER = 'TIMER/START';
export interface StartAction extends Action<typeof START_TIMER> {
  payload: Moment;
}
export const CANCEL_TIMER = 'TIMER/CANCEL';
export type CancelAction = Action<typeof CANCEL_TIMER>;

// type StartActionCreator = (length: number) => StartAction;
export const start = (length): StartAction => {
  const timer = moment().add(length, 'm');
  saveToLocalStorage('timer', timer);
  ipcRenderer.send('timer-started');
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // ipcRenderer.on('timer-stop', () => dispatch(cancel()));

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
