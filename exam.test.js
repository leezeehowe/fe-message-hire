const { init, send } = require("./exam.js");
const { ACTION, FIELD_ILLEGAL } = require("./commons.js");

const AccessKeyId = "LTAIPYFKbC8po527";
const AccessKeySecret = "IzWbNRkbdg41bIzmz4DTe8i2O2efCe";
const AccountName = "lee@email.leezeehowe.top";
const ReplyToAddress = true;

let taskMap = [
    {
        taskName: `deliverying a config object without "AccessKeyId"、"AccessKeySecret"、 "AccountName" , 
        ${FIELD_ILLEGAL.AccessKeyId}, "${FIELD_ILLEGAL.AccessKeySecret}", "${FIELD_ILLEGAL.AccountName}" 
        is supposed to be found in the errMsg string`,
        taskParam: {
            Action: ACTION.SINGLESENDMAIL.value,
            ReplyToAddress: "this is ReplyToAddress",
            ToAddress: "this is ToAddress",
            Subject: "this is Subject"
        },
        expectedResult: {
            errMsg: `${FIELD_ILLEGAL.AccessKeyId},${FIELD_ILLEGAL.AccessKeySecret},${FIELD_ILLEGAL.AccountName}`,
            response: null
        }
    },
    {
        taskName: `deliverying a config object with a action neither ${ACTION.SINGLESENDMAIL.value} nor "${ACTION.BATCHSENDMAIL.value}" ,
        ${FIELD_ILLEGAL.Action} 
        is supposed to be found in errMsg string`,
        taskParam: {
            Action: "supply",
            AccessKeyId: "AccessKeyId",
            AccessKeySecret: "AccessKeySecret",
            AccountName: "AccountName",
        },
        expectedResult: {
            errMsg: `${FIELD_ILLEGAL.Action}`,
            response: null
        }
    },
    {
        taskName: `while action is ${ACTION.SINGLESENDMAIL.value} and the "ToAddress" or "ReplyToAddress" or "Subject" is blank,
        ${FIELD_ILLEGAL.ToAddress} or ${FIELD_ILLEGAL.ReplyToAddress} or ${FIELD_ILLEGAL.Subject} 
        is supposed to be found in errMsg string`,
        taskParam: {
            Action: ACTION.SINGLESENDMAIL.value,
            AccessKeyId: "AccessKeyId",
            AccessKeySecret: "AccessKeySecret",
            AccountName: "AccountName",
        },
        expectedResult: {
            errMsg: `${FIELD_ILLEGAL.ReplyToAddress},${FIELD_ILLEGAL.ToAddress},${FIELD_ILLEGAL.Subject}`,
            response: null
        }
    },
    {
        taskName: `while action is ${ACTION.BATCHSENDMAIL.value} and the "TemplateName" or "ReceiversName" is blank,
        ${FIELD_ILLEGAL.TemplateName} or ${FIELD_ILLEGAL.ReceiversName} is supposed to be found in errMsg string`,
        taskParam: {
            Action: ACTION.BATCHSENDMAIL.value,
            AccessKeyId: "AccessKeyId",
            AccessKeySecret: "AccessKeySecret",
            AccountName: "AccountName",
        },
        expectedResult: {
            errMsg: `${FIELD_ILLEGAL.TemplateName},${FIELD_ILLEGAL.ReceiversName}`,
            response: null
        }
    },
    {
        taskName: `Test single: while all field in config obejct is legal, the returned object named response is supposed to be 
        available and the errMsg should be null`,
        taskParam: {
            Action: ACTION.SINGLESENDMAIL.value,
            ReplyToAddress,
            ToAddress: "1178824652@qq.com",
            AccessKeyId,
            AccessKeySecret,
            AccountName,
            TextBody: "Hello,You have been hired.",
            Subject: "introduce"
        },
        expectedResult: {
            errMsg: null,
            response: 200
        }
    },
    {
        taskName: `Test batch: while all field in config obejct is legal, the returned object named response is supposed to be 
        available and the errMsg should be null`,
        taskParam: {
            Action: ACTION.BATCHSENDMAIL.value,
            AccessKeyId,
            AccessKeySecret,
            AccountName,
            TemplateName: "introduce",
            ReceiversName: "friend"
        },
        expectedResult: {
            errMsg: null,
            response: 200
        }
    }
];


taskMap.forEach((taskItem) => {
    test(taskItem.taskName, (done) => {
        return send(taskItem.taskParam)
            .then(({ response }) => {
                if (response) {
                    expect(response.status).toBe(taskItem.expectedResult.response);
                    done();
                }
            })
            .catch(({ errorMsg }) => {
                if (errorMsg) {
                    expect(errorMsg).toBe(taskItem.expectedResult.errMsg);
                    done();
                }
            });
    });
});

// taskMap.forEach((taskItem) => {
//     test(taskItem.taskName, (done) => {
//         const callback = (errMsg, response) => {
//             let received = {
//                 errMsg,
//                 response: response ? response.status : response  
//             };
//             expect(received).toEqual(taskItem.expectedResult);
//             done();
//         };
//         send(taskItem.taskParam, callback);
//         init({AccessKeyId, AccessKeySecret, AccountName});
//     });
// });

// init({AccessKeyId, AccessKeySecret, AccountName});
