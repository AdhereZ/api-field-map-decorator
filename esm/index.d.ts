export declare const baseDecorator: (sourceKey: string, targetType: string) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare const deepDecorator: (sourceKey: string, clazz: {
    new ();
}) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare const filterDecorator: (sourceKey: string, filter: () => any) => {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare const deserialize: (json: object, clazz: {
    new ();
}) => any;
export declare const deserializeArr: (json: Array<any>, clazz: {
    new ();
}) => Array<any>;
