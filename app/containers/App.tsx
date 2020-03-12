import React, { ReactNode } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Switch, FormControlLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Moment } from 'moment';
import { Header } from '../components/Header/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTimer } from '../selectors/timer';

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

  // const [timer, setoptTimer] = useLocalStorage<string | null>('timer', null);
  // const timerMoment = timer !== null ? moment(timer) : null;

  // const startTimer = () => {
  //   setTimer(moment().add(length, 'm'));
  //   ipcRenderer.send('timer-started');
  // };

  // const stopTimer = () => {
  //   setTimer(null);
  //   ipcRenderer.send('timer-stopped');
  // };

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
