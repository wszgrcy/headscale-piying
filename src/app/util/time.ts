import dayjs from 'dayjs';

export function timeCompare(setTime: string, currentTime: string | Date = new Date()) {
  return dayjs(setTime).isAfter(dayjs(currentTime));
}
