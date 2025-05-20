import { formatInTimeZone } from 'date-fns-tz';

export const getUtcDate = (date: Date = new Date()): Date => {
  const utcDate: string = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd HH:mm:ss');
  return new Date(utcDate);
};
