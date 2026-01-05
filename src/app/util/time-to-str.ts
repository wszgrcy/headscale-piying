import dayjs from 'dayjs';

export function datetimeToStr(str: string) {
  return dayjs(str).format('YYYY-MM-DD HH:mm');
}
export function formatDatetimeToStr(str?: string) {
  if (!str) {
    return '';
  }
  return datetimeToStr(str);
}
