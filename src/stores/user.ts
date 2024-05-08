import { defineStore } from 'pinia'
import { UserApi } from '@/api/system/user'
import { Session } from '@/utils/storage'

type MenuDataItem = UserApi_GetMenuItem

type UserInfoData = UserAdminInfo

/**
 * 用户信息
 * @methods setUserInfo 设置用户信息
 * @methods updateUserInfo 更新用户信息
 */
export const useUserState = defineStore('useUser', {
    state: () => ({
        userInfo: {} as UserInfoData, // 用户信息
        state: Session.get('adm') === 'adm',
        // state: true,
        menuList: [] as MenuDataItem[], // 权限菜单
        company_group_id: '' as '' | number, // 当前的公司分组id
    }),
    actions: {
        async setUserInfo() {
            // 获取用户信息、同时获取到对应的菜单（减少首次进入等待时间）
            const [res1] = await Promise.all([
                UserApi.getAdmin(),
                // UserApi.getMenu(),
            ])

            if (res1.code === 200) {
                const user = res1.data
                this.updateUserInfo(user)
            } else {
                throw ('返回用户信息有误！')
            }
            // if (res2.code == 200) {
            //     this.menuList = res2.data.menu
            // }

            // const data = {
            //     id: 1,
            //     account: 'admin',
            //     phone: '15555555555',
            //     realname: 'admin',
            //     last_login_time: 1677652941,
            //     last_ip: '113.110.147.135',
            //     role_id: 1,
            //     role_code: 'super_admin',
            //     status: 1,
            //     company_id_str: '',
            //     is_delete: 0,
            //     type: 1,
            //     created_at: 1667980332,
            //     group_id: 100,
            //     group_id_str: '100',
            //     company_id: 1,
            //     company_group_id: '500,501,502,503,504,505,506,507,508,509,510,613,616',
            //     supplier_id: 0,
            //     is_goods_role: 0,
            //     menu_id: '16,19,9,20,10,21,22,23,25,27,28,29,75,76,2,4,107,12,164,5,13,14,30,31,32,33,34,1,6,35,17,18,73,74,37,38,40,41,42,43,44,81,82,68,69,77,78,79,80,24,46,48,49,50,83,84,52,85,53,86,127,157,158,87,141,128,142,88,129,147,57,58,59,60,89,92,93,150,90,91,94,95,148,149,96,140,165,170,171,70,71,97,130,131,98,99,66,100,122,104,111,105,110,106,121,126,132,133,134,135,138,139,115,118,116,119,120,117,123,125,136,137,151,152,153,154,155,159,156',
            //     role_name: '超级管理员',
            //     company_id_list: [
            //         1,
            //         4,
            //         45,
            //         46,
            //         51,
            //         52,
            //         53,
            //         63,
            //         64,
            //         76,
            //         40,
            //         56,
            //         57,
            //         39,
            //         36,
            //         37,
            //         38,
            //         59,
            //         60,
            //         30,
            //         31,
            //         32,
            //         33,
            //         34,
            //         35,
            //         58,
            //         28,
            //         29,
            //         41,
            //         42,
            //         43,
            //         24,
            //         25,
            //         26,
            //         27,
            //         2,
            //         3,
            //         5,
            //         6,
            //         7,
            //         8,
            //         9,
            //         10,
            //         11,
            //         12,
            //         13,
            //         14,
            //         15,
            //         61,
            //         62,
            //         16,
            //         17,
            //         18,
            //         19,
            //         20,
            //         21,
            //         22,
            //         23,
            //         44,
            //         47,
            //         48,
            //         49,
            //         50,
            //         54,
            //         55,
            //         78,
            //         79,
            //         77,
            //     ],
            //     supplier_name: null,
            // }

            // this.updateUserInfo(data)
        },
        updateUserInfo(data: UserApi_GetAdminResponse) {
            // admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
            const adminRoles: Array<string> = ['admin']
            // admin 按钮权限标识
            const adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link']
            // // test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
            // let testRoles: Array<string> = ['common'];
            // // test 按钮权限标识
            // let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];

            // 用户信息
            const userInfo = {
                ...data,
                photo: '',
                time: new Date().getTime(),
                roles: adminRoles,
                authBtnList: adminAuthBtnList,
            }

            this.userInfo = userInfo // 重新设置userData
            // Session.set("userData", userInfo)
        },
    },
})
