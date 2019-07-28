/**
 * 把字符串的第一个字符大写
 * @param {*} str 
 */
const upperCaseFirstChar = function(str) {
    if(!str || str == "") {
        throw new Error("illegal paramter " + str);
    }
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

module.exports = {
    upperCaseFirstChar
}

