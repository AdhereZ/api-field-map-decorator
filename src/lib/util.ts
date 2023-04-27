import 'reflect-metadata';

const DECORATOR_KEY = 'decorator_key';

export const setMetaData = (metedata: object) => {
  return Reflect.metadata(DECORATOR_KEY, metedata);
};

export const getMetaData = (clazz: { new () }, targetKey: string) => {
  return Reflect.getMetadata(DECORATOR_KEY, new clazz(), targetKey);
};

export const isInvalidDate = (date: any): boolean => date instanceof Date && isNaN(date.getTime());

export function formatDate(timestamp: string | number | Date, format = 'Y-M-D h:m:s') {
  const date = new Date(timestamp);
  if (isInvalidDate(date)) {
    return timestamp;
  }
  const dateInfo = {
    Y: `${date.getFullYear()}`,
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  const formatNumber = (n: number) => (n >= 10 ? `${n}` : `0${n}`);
  return format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s));
}
