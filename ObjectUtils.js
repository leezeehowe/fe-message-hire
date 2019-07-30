/**
 * 复制一个from对象的指定属性到to对象上
 * @param {*} to 目标对象
 * @param {*} from 源对象
 * @param  {...any} fieldsName 被复制的属性名数组
 */
const assignSpecificFields = function(to, from, ...fieldsName) {
    if(!fieldsName || !(fieldsName instanceof Array)) {
        throw new Error("error parameter");
    }
    fieldsName.forEach((name) => {
        if(from[name]) {
            to[name] = from[name];
        }
    });
};

/**
 * 字符串数组转对象
 * @param {Array} keyArray 
 */
const keyArrayToObject = function(...keyArray) {
    if(!keyArray || !(keyArray instanceof Array)) {
        throw new Error("error parameter");
    }
    const obj = {};
    keyArray.forEach((fieldName) => {
        obj[fieldName] = null;
    });
    return obj;
};

/**
 * 深拷贝对象
 * @param {Object} source 
 */
const deepCopyObject = function(source) {
    if(!!source) {
        return JSON.parse(JSON.stringify(source));
    }
}

module.exports = {
    assignSpecificFields,
    keyArrayToObject,
    deepCopyObject
};


