import React, { PropsWithChildren } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/AvTimer';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  flex-grow: 1;
`;

const StyledTimerIcon = styled(TimerIcon)`
  margin-right: 8px;
`;

export const Header = ({ children }: PropsWithChildren<{}>) => (
  <AppBar position="static" color="inherit">
    <Toolbar variant="dense">
      <StyledTimerIcon />
      <StyledTypography variant="h6">Pomodoro</StyledTypography>
      <div>{children}</div>
    </Toolbar>
  </AppBar>
);
