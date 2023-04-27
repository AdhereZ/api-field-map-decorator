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
  // console.log('json:', json);

  const instance = new clazz();
  const keys = Object.keys(instance);
  for (const key of keys) {
    const metadata = getMetaData(clazz, key);
    if (!metadata) {
      instance[key] = json[key];
      continue;
    }
    const value = json[metadata.sourceKey];
    // console.log('metadata:', metadata);
    console.log('metadata:', metadata);
    console.log('key:', key);

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
  console.log('arr:', arr);
  console.log('arr[0]:', arr[0]);

  return arr;
};

class Lesson {
  @baseDecorator('ClassName', 'string')
  public name: string;
  @baseDecorator('Teacher', 'string')
  public teacher: string;
  @baseDecorator('DateTime', 'datetime')
  public datetime: string;
  @baseDecorator('Date', 'date')
  public date: string;
  @baseDecorator('Time', 'time')
  public time: string;
  @baseDecorator('Compulsory', 'boolean')
  public compulsory: boolean;

  constructor() {
    this.name = '';
    this.teacher = '';
    this.datetime = '';
    this.date = '';
    this.time = '';
    this.compulsory = false;
  }
}

class Address {
  @baseDecorator('province', 'string')
  public province: string;
  @baseDecorator('city', 'string')
  public city: string;
  @baseDecorator('full_address', 'string')
  public fullAddress: string;

  constructor() {
    this.province = '';
    this.city = '';
    this.fullAddress = '';
  }
}

class Student {
  @baseDecorator('StudentID', 'string')
  public id: string;
  @baseDecorator('StudentName', 'string')
  public name: string;
  @baseDecorator('StudentAge', 'int')
  public age: number;
  @baseDecorator('NotFloat', 'float')
  public notFloat: number;
  @baseDecorator('NotANum', 'int')
  public notNum: number;
  @baseDecorator('UnknownType', 'String')
  public unknownType: string;
  @filterDecorator('StudentSex', (val = 0) => {
    const map = { 0: '未知', 1: '男生', 2: '女生' };
    return map[val];
  })
  public sex: string;
  @baseDecorator('Grade', 'float')
  public grade: number;
  @deepDecorator('Address', Address)
  public address?: Address;
  @deepDecorator('Lessons', Lesson)
  public lessons?: Lesson[];
  @filterDecorator('State', (val = 0) => {
    const map = { '0': '未知', '1': '读书中', '2': '辍学', '3': '毕业' };
    return map[`${val}`];
  })
  public status: string;
  public extra: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.age = 0;
    this.notNum = 0;
    this.notFloat = 0;
    this.sex = '';
    this.unknownType = '';
    this.grade = 0;
    this.address = undefined;
    this.lessons = undefined;
    this.status = '';
    this.extra = '';
  }
}

const Students = [
  {
    StudentID: '123456',
    StudentName: '李子明',
    StudentAge: '10',
    StudentSex: 1,
    NotANum: 'lol',
    NotFloat: 'def',
    UnknownType: 'funny',
    Grade: '98.6',
    Address: {
      province: '广东',
      city: '深圳',
      full_address: 'xxx小学三年二班',
    },
    Lessons: [
      {
        ClassName: '中国上下五千年',
        Teacher: '建国老师',
        DateTime: 1609430399000,
        Date: 1609430399000,
        Time: 1609430399000,
        Compulsory: 1,
      },
      {
        ClassName: '古筝的魅力',
        Teacher: '美丽老师',
        DateTime: '',
      },
    ],
    State: 1,
    extra: '额外信息',
  },
  {
    StudentID: '888888',
    StudentName: '丁仪',
    StudentAge: '18',
    StudentSex: 2,
    Grade: null,
    Address: {
      province: '浙江',
      city: '杭州',
      full_address: 'xxx中学高三二班',
    },
    Lessons: [],
    State: 2,
  },
];

const arr = deserializeArr(Students, Student);
