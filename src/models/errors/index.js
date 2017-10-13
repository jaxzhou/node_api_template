
const messages = {
  UserNotFound: {
    message: 'User Not Found',
    message_zh: '找不到用户',
    status: 404
  },
  FileNotFound : {
    message: 'File Not Found',
    message_zh: '找不到文件',
    status: 404
  },
  AccessDenied : {
    message: 'Action Not Allowed',
    message_zh: '没有权限进行该操作',
    status: 403
  },
  ParamsError : {
    message: 'Params is Error',
    message_zh: '参数错误',
    status: 400
  },
  UnAuthorized : {
    message: 'Not Authorized',
    message_zh: '需要认证',
    status: 401
  },
  IllegalName : {
    message: 'Name Contain Illegal Chars',
    message_zh: '用户名不合法',
    status: 400
  }
};

export default class BaseError extends Error {
  constructor(code) {
    if (messages[code]) {
      super(messages[code].message);
      this.message_zh = messages[code].message_zh;
      this.status = messages[code].status || 500;
    } else {
      super(code);
    }
    this.code = code || 'ServerError';
  }

  toString() {
    const json = {
      message: this.message,
      code: this.code,
      message_zh: this.message_zh
    };
    return JSON.stringify(json);
  }
}

Object.keys(messages).forEach(k => {
  exports[k] = new BaseError(k);
});
