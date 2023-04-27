import 'reflect-metadata';
var DECORATOR_KEY = 'decorator_key';
export var setMetaData = function (metedata) {
    return Reflect.metadata(DECORATOR_KEY, metedata);
};
export var getMetaData = function (clazz, targetKey) {
    return Reflect.getMetadata(DECORATOR_KEY, new clazz(), targetKey);
};
export var isInvalidDate = function (date) { return date instanceof Date && isNaN(date.getTime()); };
export function formatDate(timestamp, format) {
    if (format === void 0) { format = 'Y-M-D h:m:s'; }
    var date = new Date(timestamp);
    if (isInvalidDate(date)) {
        return timestamp;
    }
    var dateInfo = {
        Y: "".concat(date.getFullYear()),
        M: "".concat(date.getMonth() + 1),
        D: "".concat(date.getDate()),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
    };
    var formatNumber = function (n) { return (n >= 10 ? "".concat(n) : "0".concat(n)); };
    return format
        .replace('Y', dateInfo.Y)
        .replace('M', dateInfo.M)
        .replace('D', dateInfo.D)
        .replace('h', formatNumber(dateInfo.h))
        .replace('m', formatNumber(dateInfo.m))
        .replace('s', formatNumber(dateInfo.s));
}
