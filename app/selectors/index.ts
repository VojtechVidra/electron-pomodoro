import moment, { Moment } from 'moment';

export const getTimer = (state): Moment | null =>
  state.timer ? moment(state.timer) : null;

export const getTimerLength = (state): number => state.timerLength;
