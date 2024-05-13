import { post,get } from '@/utils/http/request'

// 、、、、、、、、、、、、、、、、、、、、、////////////////

// 获取系统信息
export const getSystemInfo = () => post<SystemCompanyApi_GetInfoResponse>('/api/v1/system/info')
// 修改系统信息
export const setSystemInfo = (data: ISystemEditParams) => post<SystemCompanyApi_GetInfoResponse>('/api/v1/system/edit', data)

// 用户、、、、、、、、、、、、、、、、、、////////////////
// 获取用户列表
export const getUserList = (data: UserApi_GetList) => post<UserApi_GetListResponse>('/api/v1/admin/get_list', data)
// 新增用户
export const setUserAdd = (data: UserApi_Add) => post('/api/v1/admin/add', data)
// 修改用户
export const setUserUpdate = (data: UserApi_Edit) => post('/api/v1/admin/edit', data)
// 删除用户
export const setUserDelete = (data: { id: number }) => post('/api/v1/admin/delete', data)
// 修改密码
export const setUserPassword = (data: UserApi_EditPassword) => post('/api/v1/admin/edit_password', data)

// 获取管理员信息(当前登录用户信息)
export const getAdminInfo = () => get<UserApi_GetAdminResponse>('/api/v1/admin/info')

// 菜单、、、、、、、、、、、、、、、、、、////////////////

// 获取菜单列表
export const getMenuList = (data?: MenuApi_List) => post<MenuApi_ListResponse>('/api/v1/menu/get_list', data)
// 添加菜单
export const setMenuAdd = (data: MenuApi_Add) => post('/api/v1/menu/add', data)
// 修改菜单
export const setMenuUpdate = (data: MenuApi_Edit) => post('/api/v1/menu/edit', data)
// 删除菜单
export const setMenuDelete = (data: { id: number }) => post('/api/v1/menu/delete', data)
