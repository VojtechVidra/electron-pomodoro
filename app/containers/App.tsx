import React, { ReactNode, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Switch, FormControlLabel } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components/Header/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cancel, start } from '../actions/timer';
import { durationTo } from '../utils/timeUtils';
import { getTimer, getTimerLength } from '../selectors';

type Props = {
  children: ReactNode;
};

export default function App({ children }: Props) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [enableDark, setEnableDark] = useLocalStorage<boolean>(
    'dark-mode',
    false
  );

  const darkIsEnabled = prefersDarkMode || enableDark || false;

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkIsEnabled ? 'dark' : 'light'
        }
      }),
    [darkIsEnabled]
  );

  const dispatch = useDispatch();

  const timer = useSelector(getTimer);
  const leftDuration = timer && durationTo(timer);

  useEffect(() => {
    if (leftDuration) {
      const timeoutId = setTimeout(() => {
        dispatch(cancel());
        ipcRenderer.send('timer-end');
      }, leftDuration.asMilliseconds());

      return () => clearInterval(timeoutId);
    }
  }, [leftDuration]);

  const length = useSelector(getTimerLength);
  const startTimer = () => dispatch(start(length));
  const stopTimer = () => dispatch(cancel());

  useEffect(() => {
    ipcRenderer.on('timer-start', startTimer);
    ipcRenderer.on('timer-stop', stopTimer);

    return () => {
      ipcRenderer.removeListener('timer-start', startTimer);
      ipcRenderer.removeListener('timer-stop', stopTimer);
    };
  }, [startTimer, stopTimer]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header>
        <FormControlLabel
          control={
            <Switch
              checked={darkIsEnabled}
              onChange={() => {
                setEnableDark(prev => !prev);
              }}
            />
          }
          label="Dark"
        />
      </Header>

      {children}
    </ThemeProvider>
  );
}
