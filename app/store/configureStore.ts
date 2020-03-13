import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';
import {
  saveToLocalStorage,
  loadFromLocalStorage
} from '../utils/storageUtils';
import { Store } from '../reducers/types';

const selectedConfigureStore =
  process.env.NODE_ENV === 'production'
    ? configureStoreProd
    : configureStoreDev;

export const { configureStore }: { configureStore: () => Store } = {
  configureStore: () => {
    const persistedState = loadFromLocalStorage('store');
    const store = selectedConfigureStore.configureStore(persistedState);

    store.subscribe(() => {
      saveToLocalStorage('store', {
        timer: store.getState().timer,
        timerLength: store.getState().timerLength
      });
    });

    return store;
  }
};

export const { history } = selectedConfigureStore;
