/**
 * 复制一个from对象的指定属性到to对象上
 * @param {*} to 目标对象
 * @param {*} from 源对象
 * @param  {...any} fieldsName 被复制的属性名数组
 */
const assignSpecificFields = function(to, from, ...fieldsName) {
    fieldsName.forEach(name => {
        if(from[name]) to[name] = from[name];
    });
};

module.exports = {
    assignSpecificFields
};

