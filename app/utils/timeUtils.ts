import moment, { Moment } from 'moment';

export const durationTo = (t: Moment) => moment.duration(t.diff(moment()));
