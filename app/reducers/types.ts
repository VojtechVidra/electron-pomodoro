import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type RootStateType = {
  timer: string | null;
  timerLength: number;
};

export type GetState = () => RootStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<RootStateType, Action<string>>;
