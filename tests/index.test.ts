import { baseDecorator, deepDecorator, filterDecorator, deserialize, deserializeArr } from '../src';
import { formatDate } from '../src/lib/util';

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

class Staff {
  @baseDecorator('StaffID', 'string')
  public id: string;
  @baseDecorator('StaffName', 'string')
  public name: string;
  @baseDecorator('StaffAge', 'int')
  public age: number;
  @baseDecorator('NotFloat', 'float')
  public notFloat: number;
  @baseDecorator('NotANum', 'int')
  public notNum: number;
  // @ts-ignore
  @baseDecorator('UnknownType', 'String')
  public unknownType: string;
  @filterDecorator('StaffSex', (val = 0) => {
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
  // @ts-ignore
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

const Staffs = [
  {
    StaffID: '1111',
    StaffName: 'Tom',
    StaffAge: '10',
    StaffSex: 1,
    NotANum: 'function',
    NotFloat: 'def',
    UnknownType: 'funny',
    Grade: '922.6',
    Address: {
      province: '广东',
      city: '深圳',
      full_address: '深圳小学三年二班',
    },
    Lessons: [
      {
        ClassName: '数学',
        Teacher: '武忠祥',
        DateTime: 1609430399000,
        Date: 1609430399000,
        Time: 1609430399000,
        Compulsory: 1,
      },
      {
        ClassName: '英语',
        Teacher: 'Lily',
        DateTime: '',
      },
    ],
    State: 1,
    extra: '额外信息',
  },
  {
    StaffID: '2345',
    StaffName: 'Ming',
    StaffAge: '21',
    StaffSex: 2,
    Grade: null,
    Address: {
      province: '湖北',
      city: '武汉',
      full_address: '华中师范大学',
    },
    Lessons: [],
    State: 2,
  },
];

const arr = deserializeArr(Staffs, Staff);
console.log(arr);
describe('transformer', () => {
  test('name', () => {
    expect(arr[0].id).toBe('123456');
  });

  test('type', () => {
    expect(arr[1].age).toBe(18);
    expect(arr[0].grade).toBeCloseTo(98.6);
    expect(arr[1].grade).toBeNull();
  });

  test('deep', () => {
    expect(arr[0].address.city).toBe('深圳');
  });
});

describe('filter', () => {
  test('inner', () => {
    const [target] = arr[0].lessons || [];
    const times = 1609430399000;
    const datetime = formatDate(times);
    const date = formatDate(times, 'Y-M-D');
    const time = formatDate(times, 'h:m:s');
    expect(target.datetime).toBe(datetime);
    expect(target.date).toBe(date);
    expect(target.time).toBe(time);
  });

  test('custom', () => {
    expect(arr[0].sex).toBe('男生');
    expect(arr[1].status).toBe('辍学');
  });
});

describe('boundary', () => {
  test('do nothing', () => {
    expect(arr[0].extra).toBe('额外信息');
  });
});
