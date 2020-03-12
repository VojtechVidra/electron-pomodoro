import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const TimeLeft = ({ hours, minutes, seconds }: Props) => {
  const { t } = useTranslation();

  return (
    <Typography>
      {hours ? t('hour', { count: hours }) + ' ' : null}
      {minutes ? t('minute', { count: minutes }) + ' ' : null}
      {seconds ? t('second', { count: seconds }) + ' ' : null}
      {t('left')}
    </Typography>
  );
};
