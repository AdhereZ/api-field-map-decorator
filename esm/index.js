import { setMetaData, getMetaData } from './lib/util';
import { transform } from './lib/transformer';
export var baseDecorator = function (sourceKey, targetType) {
    var metadata = {
        sourceKey: sourceKey,
        targetType: targetType,
    };
    return setMetaData(metadata);
};
export var deepDecorator = function (sourceKey, clazz) {
    var metadata = {
        sourceKey: sourceKey,
        clazz: clazz,
    };
    return setMetaData(metadata);
};
export var filterDecorator = function (sourceKey, filter) {
    var metadata = {
        sourceKey: sourceKey,
        filter: filter,
    };
    return setMetaData(metadata);
};
export var deserialize = function (json, clazz) {
    var instance = new clazz();
    var keys = Object.keys(instance);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var metadata = getMetaData(clazz, key);
        if (!metadata) {
            instance[key] = json[key];
            continue;
        }
        var value = json[metadata.sourceKey];
        if (metadata.targetType) {
            instance[key] = transform(json[metadata.sourceKey], metadata.targetType);
        }
        else if (metadata.clazz) {
            if (Array.isArray(value)) {
                instance[key] = deserializeArr(value, metadata.clazz);
            }
            else {
                instance[key] = deserialize(value, metadata.clazz);
            }
        }
        else if (metadata.filter) {
            instance[key] = metadata.filter(value);
        }
    }
    return instance;
};
export var deserializeArr = function (json, clazz) {
    var arr = [];
    for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
        var item = json_1[_i];
        arr.push(deserialize(item, clazz));
    }
    return arr;
};
