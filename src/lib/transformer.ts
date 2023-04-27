import { formatDate } from './util';

export const transform = (value: any, type: string) => {
  let newValue = null;
  try {
    switch (type) {
      case 'int':
        newValue = parseInt(value);
        if (newValue !== newValue) {
          // NaN
          throw new Error('int类型转换失败');
        }
        break;
      case 'float':
        newValue = parseFloat(value);
        if (newValue !== newValue) {
          // NaN
          throw new Error('float类型转换失败');
        }
        break;
      case 'string':
        newValue = value + '';
        break;
      case 'boolean':
        newValue = Boolean(value);
        break;
      case 'date':
        newValue = formatDate(value, 'Y-M-D');
        break;
      case 'time':
        newValue = formatDate(value, 'h:m:s');
        break;
      case 'datetime':
        newValue = formatDate(value);
        break;
      default:
        newValue = value;
        break;
    }
  } catch (err) {
    newValue = value;
  }
  return newValue;
};
