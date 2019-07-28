const {assignSpecificFields} = require('./ObjectUtils.js');
const crypto  = require("crypto");
const axios = require("axios");
const {ACTION, FIELD_ILLEGAL, SIGNATURE_METHOD} = require('./commons.js');
const url = 'https://dm.aliyuncs.com/';

const AccessKeyId = '';
const AccessKeySecret = '';
const AccountName = '';

const send = function (inputConfig, cb) {
    let errorMsg = [];
    const config = Object.assign(getCache(), inputConfig);
    let param = {};
    
    // 校验config参数，并合并返回的错误信息
    errorMsg = errorMsg.concat(verifyConfig(['AccessKeyId', 'AccessKeySecret', 'AccountName'], config));

    // 根据config的action属性执行对应操作
    param = getBasicParam(config);

    // 用户需要调用的接口名
    let userInputAction = config.Action || "";

    // 获取调用该接口所需的信息
    const actionInfoObject = ACTION[userInputAction.toUpperCase()];

    // 如果无法找到所需的信息，表明接口名不合法
    if(!actionInfoObject) 
    {
        errorMsg.push(FIELD_ILLEGAL.Action);
        return cb(errorMsg.join(','), null);
    }

    // 校验config中是否全部包含该接口强制要求的字段
    errorMsg = errorMsg.concat(verifyConfig(actionInfoObject.neededParam, config));
    
    // 如果错误信息数量不为0，执行回调返回
    if (errorMsg.length) {
        return cb(errorMsg.join(','), null);
    }

    // 根据所需调用的接口，包装接口所需的强制要求的请求参数
    assignSpecificFields(param, config, ...actionInfoObject.neededParam);
    // 根据所需调用的接口，包装接口所需的可选的请求参数    
    assignSpecificFields(param, config, ...actionInfoObject.choosableParam);

    // 根据param生成签名
    const signature = buildSignature(param, config);

    // 根据param和密钥生成请求体
    const reqBody = buildReqBody(param, {Signature: signature});

    // 发送请求
    axios.post(url, reqBody, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    // 邮件发送生成
    .then(response => {
        return cb(null, response);
    })
    // 请求失败或者未发出请求
    .catch(error => {
        // 如果已发出请求但业务失败，返回提示信息，否则返回错误信息
        let message = "";
        let response = error.response;
        if(response && response.data) message = response.data.Code + ":" + response.data.Message; 
        return cb(message || error.message, null);
    })
};

const init = function({AccessKeyId, AccessKeySecret, AccountName}) {
    this.AccessKeyId = AccessKeyId;
    this.AccessKeySecret = AccessKeySecret;
    this.AccountName = AccountName;
}

module.exports = {
    init,
    send
}

const getCache = function() {
    return {
        AccessKeyId: this.AccessKeyId,
        AccessKeySecret: this.AccessKeySecret,
        AccountName: this.AccountName
    }
}

/**
 * 校验config对象里对应field的字段是否有值
 * @param {Array} field 需要校验的字段的key
 * @param {Object} config 被校验的对象
 * 返回一个错误信息数组
 */
const verifyConfig = function(field, config) {
    const errorMsg = [];
    field = field || [];
    field.forEach(field_name => {
        let field_value = config[field_name];
        if(!field_value) {
            errorMsg.push(FIELD_ILLEGAL[field_name]);
        }
    })
    return errorMsg;
}

/**
 * 解析config对象，获取基本的param对象
 * @param {*} config
 */
const getBasicParam = function({AccessKeyId, AccountName, AddressType}) {
    let nonce           = Date.now();
    let date            = new Date();
    return {
        Format: 'JSON',
        Version: '2015-11-23',
        AccessKeyId: AccessKeyId,
        SignatureMethod: 'HMAC-SHA1',
        Timestamp: date.toISOString(),
        SignatureVersion: '1.0',

        AccountName: AccountName,
        AddressType: AddressType ? AddressType : 0,
        SignatureNonce: nonce
    };
}

/**
 * 生成密钥
 * @param {Object} map 
 * @param {*} param1 
 */
const buildSignature = function(param, {AccessKeySecret}) {
    let signStr = "";
    let signStrArray = [];
    Object.keys(param).forEach(key => {
        signStrArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(param[key]));
    });
    signStrArray.sort();
    signStr = signStrArray.join("&");
    signStr = 'POST&%2F&' + encodeURIComponent(signStr);
    const sign = crypto.createHmac(SIGNATURE_METHOD, AccessKeySecret + '&')
        .update(signStr)
        .digest('base64');
    return encodeURIComponent(sign);
}

/**
 * 生成请求体
 * @param {} map 
 * @param {*} extraField 
 */
const buildReqBody = function(map, extraField) {
    const reqBody = [];
    let param = Object.assign(map, extraField);
    Object.keys(param).forEach(key => {
        reqBody.push(key + '=' + param[key])
    });
    return reqBody.join('&');
}
