import { post } from '@/utils/http/request'

/**
 * 角色管理api
 */
export const RoleApi = {
    /**
     *
     * 角色管理 - 获取列表
     * @returns
     */
    getList: (data: RoleApi_GetList) => post<RoleApi_GetListResponse>('/api/admin/get_role_list', data),

    /**
     * 角色管理 - 新增
     */
    add: (data: RoleApi_Add) => post('/api/admin/add_role', data),

    /**
     * 角色管理 - 修改
     */
    edit: (data: RoleApi_Edit) => post('/api/admin/edit_role_submit', data),

    /**
     * 角色管理 - 删除
     */
    del: (data: { role_id: number }) => post('/api/admin/delete_role', data),

}
