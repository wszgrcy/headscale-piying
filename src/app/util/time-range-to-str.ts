import dayjs from 'dayjs';

export function timeRangeToStr(range: [Date, Date]) {
  const start = dayjs(range[0]);
  const end = dayjs(range[1]);

  if (start.year() === end.year()) {
    return `${start.year()}-${start.format('MM-DD')} - ${end.format('MM-DD')}`;
  } else {
    return `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}`;
  }
}
