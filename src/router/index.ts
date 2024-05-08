import { createRouter, createWebHashHistory } from 'vue-router'

import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
import pinia from '@/stores/index'
import { useKeepALiveNames } from '@/stores/keepAliveNames'
import { useThemeConfig } from '@/stores/themeConfig'
import { Session } from '@/utils/storage'
import { staticRoutes } from '@/router/route'
import { initFrontEndControlRoutes } from '@/router/frontEnd'
import { initBackEndControlRoutes } from '@/router/backEnd'
import { useTitle } from '@/utils/other'

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */

// 读取 `/src/stores/themeConfig.ts` 是否开启后端控制路由配置
const storesThemeConfig = useThemeConfig(pinia)
const { isRequestRoutes } = storesThemeConfig.themeConfig

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options:RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
const base_url = import.meta.env.BASE_URL // 获取vite.config.js配置的base,默认是根目录/

export const router = createRouter({
    // history: createWebHistory(base_url),
    history: createWebHashHistory(base_url),
    routes: staticRoutes,
})

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
    if (arr.length <= 0) return false
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
            arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
        }
    }
    // let ax = arr.filter((item: { path: any; }) => item.path);
    return arr
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
    if (arr.length <= 0) return false
    const newArr: any = []
    const cacheList: Array<string> = []

    arr.forEach((v: any) => {
        if (v.path === '/') {
            newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] })
        } else {
            // 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
            // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
            if (v.path.includes('/:')) {
                v.meta.isDynamic = true
                v.meta.isDynamicPath = v.path
            }
            newArr[0].children.push({ ...v })
            // 存 name 值，keep-alive 中 include 使用，实现路由的缓存
            // 路径：@/layout/routerView/parent.vue
            if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
                cacheList.push(v.name)
                const stores = useKeepALiveNames(pinia)
                stores.setCacheKeepAlive(cacheList)
            }
        }
    })
    return newArr
}

// 第一次进入（或者刷新）也就是未加载路由时，设置状态为false
let isFlag = false

// 路由加载前
router.beforeEach(async (to, from, next) => {
    NProgress.configure({ showSpinner: false })
    if (to.meta.title) NProgress.start()
    const token = Session.get('token')
    // console.log(token);
    // return
    if (!token) { // 没有token时
        if (to.path === '/login') { // 在登录页时，不处理，直接进入
            next()
        } else { // 跳到登录页
            next('/login')
            Session.clear()
        }
    } else if (to.path === '/login') { // 有token，又在登录页面时，跳转到首页
        next('/')
    } else {
        // const storesRoutesList = useRoutesList(pinia);
        // console.log(JSON.parse(JSON.stringify(storesRoutesList.routesList)));

        if (isFlag) {
            next()
        } else {
            if (isRequestRoutes) {
                // 后端控制路由：路由数据初始化，防止刷新时丢失
                await initBackEndControlRoutes()
            } else {
                // 设置路由，前端控制
                await initFrontEndControlRoutes()
            }
            isFlag = true // 添加路由后设置为true,下次不在添加

            // 确保 addRoute() 时动态添加的路由已经被完全加载上去
            // next();
            // next({ ...to, replace: true });

            // 上面的情况刷新出现会404，重新设置载入路径
            next(to.fullPath)
        }
    }
})

// 路由加载后
router.afterEach(() => {
    useTitle() // 设置网站标题
    NProgress.done()
})

// 导出路由
export default router
