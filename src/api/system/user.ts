import { get, post } from '@/utils/http/request'

/**
 * 管理员api
 * @method add 添加菜单
 */
export const UserApi = {
    /**
     *
     * 管理员 - 获取列表
     * @returns
     */
    getList: (data: UserApi_GetList) => post<UserApi_GetListResponse>('/api/admin/get_list', data),

    /**
     * 管理员 - 新增
     */
    add: (data: UserApi_Add) => post('/api/admin/add', data),

    /**
     * 管理员 - 修改
     */
    edit: (data: UserApi_Edit) => post('/api/admin/edit', data),

    /**
     *  删除
     */
    del: (data: { id: number }) => post('/api/admin/delete', data),

    /**
     * 管理员 - 修改密码
     */
    editPassword: (data: UserApi_EditPassword) => post('/api/admin/edit_password', data),

    /**
     * 获取管理员信息(当前登录用户信息)
     */
    getAdmin: () => get<UserApi_GetAdminResponse>('/api/admin/info'),

    /**
     * 获取管理员权限菜单(当前登录用户)
     */
    getMenu: () => get<UserApi_GetMenuResponse>('/api/admin/get_menu'),

    /**
     * 管理员关联的用户会员
     */
    getBindList: (data: UserApi_GetBindList) => post<UserApi_GetBindListResponse>('/api/admin/binding_lists', data),

}
