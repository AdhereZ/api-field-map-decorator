import { setMetaData, getMetaData } from './lib/util';
import { transform } from './lib/transformer';

export const baseDecorator = (sourceKey: string, targetType: string) => {
  const metadata = {
    sourceKey,
    targetType,
  };
  return setMetaData(metadata);
};

export const deepDecorator = (sourceKey: string, clazz: { new () }) => {
  const metadata = {
    sourceKey,
    clazz,
  };
  return setMetaData(metadata);
};

export const filterDecorator = (sourceKey: string, filter: () => any) => {
  const metadata = {
    sourceKey,
    filter,
  };
  return setMetaData(metadata);
};

export const deserialize = (json: object, clazz: { new () }) => {
  const instance = new clazz();
  const keys = Object.keys(instance);
  for (const key of keys) {
    const metadata = getMetaData(clazz, key);
    if (!metadata) {
      instance[key] = json[key];
      continue;
    }
    const value = json[metadata.sourceKey];

    if (metadata.targetType) {
      instance[key] = transform(json[metadata.sourceKey], metadata.targetType);
    } else if (metadata.clazz) {
      if (Array.isArray(value)) {
        instance[key] = deserializeArr(value, metadata.clazz);
      } else {
        instance[key] = deserialize(value, metadata.clazz);
      }
    } else if (metadata.filter) {
      instance[key] = metadata.filter(value);
    }
  }
  return instance;
};

export const deserializeArr = (json: Array<any>, clazz: { new () }): Array<any> => {
  const arr = [];
  for (const item of json) {
    arr.push(deserialize(item, clazz));
  }

  return arr;
};
