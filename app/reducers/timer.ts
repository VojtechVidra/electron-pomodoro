import {
  START_TIMER,
  StartAction,
  CancelAction,
  CANCEL_TIMER
} from '../actions/timer';

type Actions = StartAction | CancelAction;

export default function timer(state: null | string = null, action: Actions) {
  switch (action.type) {
    case START_TIMER:
      return action.payload;
    case CANCEL_TIMER:
      return null;
    default:
      return state;
  }
}
