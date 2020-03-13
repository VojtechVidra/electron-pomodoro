import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { TimeLeft } from './TimeLeft/TimeLeft';
import { durationTo } from '../utils/timeUtils';
import { TimeSlider } from './TimeSlider/TimeSlider';
import { start, cancel } from '../actions/timer';
import { setTimerLength } from '../actions/timerLength';
import { getTimerLength, getTimer } from '../selectors';

const Home = () => {
  const { t } = useTranslation();
  const [, forceUpdate] = useForceUpdate();

  const dispatch = useDispatch();

  const length = useSelector(getTimerLength);
  const setLength = (l: number) => dispatch(setTimerLength(l));

  const timer = useSelector(getTimer);
  const leftDuration = timer && durationTo(timer);

  const startTimer = () => dispatch(start(length));
  const stopTimer = () => dispatch(cancel());

  useEffect(() => {
    if (timer) {
      const intervalId = setInterval(forceUpdate, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

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
