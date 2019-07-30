/**
 * 接口的信息：
 *  value - 接口名
 *  neededParam - 强制要求的字段
 *  choosableParam - 可选的字段
 */
const ACTION = {
    COMMON: {
        cachedConfig: ["AccessKeyId", "AccessKeySecret", "AccountName"],
        neededConfig: ["AccessKeyId", "AccessKeySecret", "AccountName"]
    },
    SINGLESENDMAIL: {
        value: "SingleSendMail",
        neededParam: ["Action", "ReplyToAddress", "ToAddress", "Subject"],
        choosableParam: ["FromAlias", "Subject", "HtmlBody", "TextBody", "TagName"]
    },
    BATCHSENDMAIL: {
        value: "BatchSendMail",
        neededParam: ["Action", "TemplateName", "ReceiversName"],
        choosableParam: ["TagName"]
    }
};


/**
 * 检测到用户传入的配置不合法时，各字段相应的反馈信息
 */
const FIELD_ILLEGAL = {
    AccessKeyId: "AccessKeyId required",
    AccessKeySecret: "AccessKeySecret required", 
    AccountName: "AccountName required",
    Action: "Error action",
    ToAddress: "ToAddress required",
    TemplateName: "TemplateName required",
    ReceiversName: "ReceiversName required",
    ReplyToAddress: "ReplyToAddress required",
    Subject: "Subject required"
};

// 密钥算法
const SIGNATURE_METHOD = "sha1";

module.exports = {
    ACTION,
    FIELD_ILLEGAL,
    SIGNATURE_METHOD
};