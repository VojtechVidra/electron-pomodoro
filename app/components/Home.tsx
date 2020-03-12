import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import moment, { Moment } from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TimeLeft } from './TimeLeft/TimeLeft';
import { durationTo } from '../utils/timeUtils';
import { TimeSlider } from './TimeSlider/TimeSlider';
import { getTimer } from '../selectors/timer';
import { start, cancel } from '../actions/timer';

const DEFAULT_LENGTH_VALUE = 25;

const Home = () => {
  const { t } = useTranslation();
  const [_, forceUpdate] = useForceUpdate();

  const [length, setLength] = useLocalStorage<number>(
    'timer-length',
    DEFAULT_LENGTH_VALUE
  );

  const dispatch = useDispatch();
  const timer = useSelector(getTimer);
  const leftDuration = timer && durationTo(timer);

  const startTimer = () => dispatch(start(length));
  const stopTimer = () => dispatch(cancel());

  const sendTimerEndSignal = () => {
    ipcRenderer.send('timer-end');
  };

  useEffect(() => {
    if (timer) {
      const intervalId = setInterval(forceUpdate, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  useEffect(() => {
    if (leftDuration && leftDuration.asMilliseconds() <= 1000) {
      sendTimerEndSignal();
      stopTimer();
    }
  }, [_]);

  useEffect(() => {
    ipcRenderer.on('timer-start', startTimer);
    ipcRenderer.on('timer-stop', stopTimer);

    return () => {
      ipcRenderer.removeListener('timer-start', startTimer);
      ipcRenderer.removeListener('timer-stop', stopTimer);
    };
  }, [startTimer, stopTimer]);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      {!timer && (
        <>
          <TimeSlider value={length} onChange={setLength} />
          <Button variant="contained" color="primary" onClick={startTimer}>
            {t('start')}
          </Button>
        </>
      )}
      {timer && (
        <>
          {leftDuration && (
            <TimeLeft
              hours={leftDuration.hours()}
              minutes={leftDuration.minutes()}
              seconds={leftDuration.seconds()}
            />
          )}
          <Button variant="contained" onClick={stopTimer}>
            {t('stop')}
          </Button>
        </>
      )}
    </div>
  );
};

export default Home;
