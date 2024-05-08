/**
 * 登录页面--验证码 响应参数
 */
declare interface LoginApi_GetCodeResponse {
    "session_id": string, //会话ID
    "validate_code": string //验证码
}

/**
 * 登录--请求参数
 */
declare interface LoginApi_Sign {

    account: string //账户
    password: string //密码
}

/**
 * 登录--响应参数
 */
declare interface LoginApi_SignResponse {

    id: number,// 用户id
    username: string,//用户名
    account: string,//登陆账号
    token: string,
}