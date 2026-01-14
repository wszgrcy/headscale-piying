import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export function timeInRange(input: string, range: [Date, Date]) {
  const instance = dayjs(input);
  return instance.isSameOrAfter(range[0]) && instance.isBefore(range[1]);
}
