import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import timer from './timer';
import timerLength from './timerLength';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    timer,
    timerLength
  });
}
