import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Grid, Slider, Input } from '@material-ui/core';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const TimeSlider = ({ onChange, value: initialValue }: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(initialValue);

  const [debouncedOnChange] = useDebouncedCallback(onChange, 300);
  const handleChange = (v: number) => {
    setValue(v);
    debouncedOnChange(v);
  };

  const handleSliderChange = (_e, v: number | number[]) => {
    handleChange(v as number);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value === '' ? 0 : Number(e.target.value));
  };

  return (
    <>
      <Typography id="input-slider" gutterBottom>
        {t('length')}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <VolumeUp />
        </Grid>
        <Grid item xs>
          <Slider
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={5}
            min={10}
            max={120}
            marks
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            margin="dense"
            onChange={handleInputChange}
            inputProps={{
              step: 5,
              min: 10,
              max: 480,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
