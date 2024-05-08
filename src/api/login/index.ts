import { get, post } from '@/utils/http/request'

/**
 * 登陆api
 * @method getCode 获取验证码
 * @method login 登录
 */
export const LoginApi = {
    /**
     *
     * 获取验证码
     * @returns
     */
    getCode: () => get<LoginApi_GetCodeResponse>('/api/admin_auth/validate_code'),

    /**
     * 登录
     */
    sign: (data: LoginApi_Sign) => post<LoginApi_SignResponse>('/api/admin/login', data),

}
