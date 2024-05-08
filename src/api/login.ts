import { post } from '@/utils/http/request'

/**
 * 登录
 */
export const setLoginSign = (data: LoginApi_Sign) => post<LoginApi_SignResponse>('/api/admin/login', data)
