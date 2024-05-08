import { post } from '@/utils/http/request'

// 、、、、、、、、、、、、、、、、、、、、、////////////////

// 获取系统信息
export const getSystemInfo = () => post<SystemCompanyApi_GetInfoResponse>('/api/system/info')
// 修改系统信息
export const setSystemInfo = (data: ISystemEditParams) => post<SystemCompanyApi_GetInfoResponse>('/api/system/edit', data)

// 用户、、、、、、、、、、、、、、、、、、////////////////
// 获取用户列表
export const getUserList = (data: UserApi_GetList) => post<UserApi_GetListResponse>('/api/admin/get_list', data)
// 新增用户
export const setUserAdd = (data: UserApi_Add) => post('/api/admin/add', data)
// 修改用户
export const setUserUpdate = (data: UserApi_Edit) => post('/api/admin/edit', data)
// 删除用户
export const setUserDelete = (data: { id: number }) => post('/api/admin/delete', data)

// 菜单、、、、、、、、、、、、、、、、、、////////////////

// 获取菜单列表
export const getMenuList = (data?: MenuApi_List) => post<MenuApi_ListResponse>('/api/menu/get_list', data)
// 添加菜单
export const setMenuAdd = (data: MenuApi_Add) => post('/api/menu/add', data)
// 修改菜单
export const setMenuUpdate = (data: MenuApi_Edit) => post('/api/menu/edit', data)
// 删除菜单
export const setMenuDelete = (data: { id: number }) => post('/api/menu/delete', data)
