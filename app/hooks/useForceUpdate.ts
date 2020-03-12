import { useState, useCallback } from 'react';

export const useForceUpdate = (): [number, () => void] => {
  const [updatePlaceholder, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return [updatePlaceholder, update];
};
