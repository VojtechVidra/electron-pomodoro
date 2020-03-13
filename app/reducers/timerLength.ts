import { SET_TIMER } from '../actions/timerLength';

const DEFAULT_LENGTH = 25;

export default function timerLength(state = DEFAULT_LENGTH, action) {
  switch (action.type) {
    case SET_TIMER:
      return action.payload;
    default:
      return state;
  }
}
