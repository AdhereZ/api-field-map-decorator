import 'reflect-metadata';
export declare const setMetaData: (metedata: object) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare const getMetaData: (clazz: {
    new ();
}, targetKey: string) => any;
export declare const isInvalidDate: (date: any) => boolean;
export declare function formatDate(timestamp: string | number | Date, format?: string): string | number | Date;
