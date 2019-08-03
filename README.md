### FE-Message-

#### 项目结构

- mail.js

  尽力改进过后的[exam-intermediate.js](https://github.com/FEMessage/hire/blob/master/exam-intermediate.js)某服务的SDK文件，向外暴露了两个接口。

  - `#init` 缓存参数，预先设置`AccessKeyId`、`AccessKeySecret`、`AccountName`,后续该三参数可选。
  - `#send` `single` or `batch` 传递所需的`neededParam` 和 可选的`choosableParam`发送 mail。

- mail.test.js

  SDK的测试文件，共有6项测试，前四项是模拟用户输入有误的情况，后两项是模拟成功的情况。

- config.js

  记录的静态常量，相当于一个配置文件，以后该SDK的大部分修改可以尝试直接修改该配置文件即可，减少修改代码。

  - `ACTION`：接口的信息
    - `COMMONT`：通用配置
    - `SINGLESENDMAIL`：单发邮件接口的配置
    - `BATCHSENDMAIL`：群发邮件接口的配置
    - `cachedConfig`：`#init`允许缓存的字段
    - `neededConfig`：`config`对象必须有的字段
  - `FIELD_ILLEGAL`：校验`config`字段不成功时的错误反馈信息

- StrUtils.js

  抽出来的可复用的字符串操作。

- ObjectUtils.js

  抽出来的可复用的对象操作。

#### 反馈

- 能真实发送邮件

  ```javascript
  const {init, send} = require('mail.js');
  const AccessKeyId = "";
  const AccessKeySecret = "";
  const AccountName = "";
  // 初始化三个参数，后续调用接口该三个参数可选
  init(AccessKeyId, AccessKeySecret, AccountName);
  // 调用single所需的最少化参数
  const single_config =  {
  	Action: 'SingleSendMail',
      ToAddress: 'leezeehowe@gmail.com',
      TextBody: 'Hello, you have been hired',
      Subject: 'FE-Message-hire',
      ReplyToAddress: true
  };
  // 发送
  send(single_config)
  .then((resolve) => {
      console.log(`成功：${resolve.response.status}`);
  })
  .catch((reject) => {
      console.log(`失败：${reject.errorMsg}`);
  });
  ```

  只需要修改`init()`的三个参数就可以给我发邮件了哦!

- 增强可读性

  1. 变量名函数名都是尽量贴切业务流程的，虽然英语有点蹩脚...

  2. 尽量把流程拆分出函数。

- 提高可维护性

  1. 把流程拆分成函数，所以修改起来可以很快的定位。
  2. 大部分的修改可以尽量通过修改抽离出来的`config.js`配置文件完成，比如说新增了一个action、可选参数、强制要求参数、允许缓存参数等等。

- 提高可易用性

  1. 添加了一个`init`方法，可以预先把基本上后续不会改变的参数缓存起来，后续调用接口就不用每次都写一遍了。
  2. 把回调函数的形式改为`Promise`，成功发送邮件将返回一个包括该`http`请求的`response`的`Object`，发送失败或者参数错误将返回一个包括`errorMsg`的错误反馈信息的`Object`。

- 请求库替换成axios

- 添加单元测试

  单元测试使用`Jest`框架。

  共有七个测试任务：
  1. 测试#init  

  2. 情景：没有输入AccessKeyId，AccessKeySecret，AccountName。

     结果：返回错误提示

     ```javascript
     "AccessKeyId required,AccessKeySecret required,AccountName required"
     ```

  3. 情景：输入了错误的Action。

     结果：返回错误提示

     ```javascript
     "Error action"
     ```

  4. 情景：`Action`输入了`SINGLESENDMAIL`,没有输入强制要求参数。

     结果：返回错误提示

     ```javascript
     "ReplyToAddress required,ToAddress required,Subject required"
     ```

  5. 情景：`Action`输入了`BACTCHSENDMAIL`，没有输入强制要求参数。

     结果：返回错误提示

     ```javascript
     "TemplateName required,ReceiversName required"
     ```

  6. 情景：`Action`输入了`SINGLESENDMAIL`,参数全部输入正确

     结果：没有返回错误提示，返回了`response`。

  7. 情景：`Action`输入了`BATCHSENDMAIL`,参数全部输入正确

     结果：没有返回错误提示，返回了`response`。
  
- 使用 [codacy](https://codacy.com/) 对自己的代码进行质量评估，至少要 B 以上, issue 要少于 10 个

  https://app.codacy.com/project/leezeehowe/fe-message-hire/dashboard?bid=13625433

