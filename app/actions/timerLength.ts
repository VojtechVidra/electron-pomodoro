export const SET_TIMER = 'SET_TIMER';

export const setTimerLength = (length: number) => {
  return {
    type: SET_TIMER,
    payload: length
  };
};
