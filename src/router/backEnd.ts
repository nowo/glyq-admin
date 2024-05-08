import type { RouteRecordRaw } from 'vue-router'
import pinia from '@/stores/index'
import { useUserState } from '@/stores/user'
import { Session } from '@/utils/storage'
import { NextLoading } from '@/utils/loading'
import { dynamicRoutes, notFoundAndNoPower } from '@/router/route'
import { formatFlatteningRoutes, formatTwoStageRoutes, router } from '@/router/index'
import { useRequestOldRoutes, useRoutesList } from '@/stores/routesList'
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes'

// vue路由菜单格式
export type MenuVueFormat = RouteRecordRaw & {
    id?: number
    title?: string

    sort?: any // 排序
    menu_type?: any // 菜单类型
}

const layoutModules = import.meta.glob('../layout/routerView/*.{vue,tsx}')
const viewsModules = import.meta.glob('../views/**/*.{vue,tsx}')

// 后端控制路由

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const dynamicViewsModules: Record<string, () => void> = Object.assign({}, { ...layoutModules }, { ...viewsModules })

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserState().setUserInfo() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */

export async function initBackEndControlRoutes() {
    // 界面 loading 动画开始执行
    if (window.nextLoading === undefined) NextLoading.start()
    // 无 token 停止执行下一步
    if (!Session.get('token')) return false
    // 触发初始化用户信息 pinia
    await useUserState().setUserInfo()

    // 获取路由菜单数据
    const vueRouterArr = await getBackEndControlRoutes()
    // console.log(vueRouterArr)
    // 存储接口原始路由（未处理component），根据需求选择使用
    useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(vueRouterArr)))
    // 处理路由（component），替换 dynamicRoutes（@/router/route）第一个顶级 children 的路由
    dynamicRoutes[0].children = await backEndComponent(vueRouterArr)
    // 添加动态路由
    await setAddRoute()
    // 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
    await setFilterMenuAndCacheTagsViewRoutes()
}

/**
 * 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setFilterMenuAndCacheTagsViewRoutes() {
    const storesRoutesList = useRoutesList(pinia)
    storesRoutesList.setRoutesList(dynamicRoutes[0].children as RouteRecordRaw[])
    setCacheTagsViewRoutes()
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
    const storesTagsView = useTagsViewRoutes(pinia)
    storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children)
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
    const filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))

    filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower]
    return filterRouteEnd
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
    await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
        router.addRoute(route)
    })
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export async function getBackEndControlRoutes() {
    // let vueRouterArr: any = [];
    // const res = await MenuApi.getAdminMenu();
    // if (res.code !== 200) return vueRouterArr;

    const menu = useUserState().menuList
    // 转成vue格式路由
    // 过滤掉组件没填写的路由
    // console.log(formatRoutes(menu));
    // vueRouterArr = formatRoutes(menu)
    const vueRouterArr = filterMenu(formatRoutes(menu))
    // console.log('vueRouterArr :>> ', vueRouterArr);
    return vueRouterArr
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/components/addMenu.vue
 */
export function setBackEndControlRefreshRoutes() {
    getBackEndControlRoutes()
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
    if (!routes) return
    return routes.map((item: any) => {
        if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string)
        item.children && backEndComponent(item.children)
        return item
    })
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, () => void>, component: string) {
    const keys = Object.keys(dynamicViewsModules)

    const matchKeys = keys.filter((key) => {
        const k = key.replace(/..\/views|../, '')
        return k.startsWith(`${component}`) || k.startsWith(`/${component}`)
    })

    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]

    // if (matchKeys?.length === 1) {
    //     const matchKey = matchKeys[0];
    //     return dynamicViewsModules[matchKey];
    // }
    // if (matchKeys?.length > 1) {
    //     return false;
    // }
}

// 后端返回的菜单数据转换成vue路由格式数据 //////////////////////////////////////////////////////////////////////

/**
 * 后端返回的路由转vue路由格式
 * @param routerArr
 * @returns
 */
export function formatRoutes(routerArr: any[]) {
    const arr: MenuVueFormat[] = []
    let obj: MenuVueFormat
    // = {};
    // let route:RouteRecordRaw={
    //     path
    // }
    routerArr.forEach((router: any) => {
        const tmp = { ...router }
        // if (tmp.type == 1) {  //只筛选出type=1的项
        if (tmp.children?.length > 0) {
            tmp.children = formatRoutes(tmp.children)
            const redirect = tmp.children[0]?.path

            // const { url, children, type } = router;
            obj = {
                // path: tmp.url,
                // name: tmp.name,
                component: tmp.page_path, // 视图路径
                path: tmp.route_path, // 路由路径
                name: tmp.route_name, // 路由名称
                redirect: redirect || tmp.redirect, // 重定向路径
                meta: {
                    id: tmp.id, // 菜单ID
                    pid: tmp.pid, // 上级菜单
                    title: tmp.title, // 菜单名称
                    level: tmp.level, // 菜单层级
                    isLink: tmp.is_link, // 是否外链  0不是  1是
                    linkUrl: tmp.link_url, // 外链地址
                    isHide: tmp.is_hide, // 是否隐藏  0不是  1是
                    isAffix: tmp.is_affix, // 是否固定  0不是  1是
                    isKeepAlive: Number(tmp.is_keep_alive) as 0 | 1, // 是否缓存  0不是  1是
                    isIframe: tmp.is_iframe, // 是否内嵌  0不是  1是
                    icon: tmp.icon, // 菜单图标
                    sort: tmp.sort, // 菜单排序 （倒序）
                    menu_type: tmp.menu_type, // 菜单类型 1菜单  2按钮
                    created_at: tmp.created_at, // 创建时间
                    roles: ['admin'], // 权限
                },
                children: tmp.children,
            }
        } else {
            obj = {
                // path: tmp.url,
                // name: tmp.name,
                component: tmp.page_path, // 视图路径
                path: tmp.route_path, // 路由路径
                name: tmp.route_name, // 路由名称
                redirect: tmp.redirect, // 重定向路径
                // meta: { title: tmp.name },
                meta: {
                    id: tmp.id, // 菜单ID
                    pid: tmp.pid, // 上级菜单
                    title: tmp.title, // 菜单名称
                    level: tmp.level, // 菜单层级
                    isLink: tmp.is_link, // 是否外链  0不是  1是
                    linkUrl: tmp.link_url, // 外链地址
                    isKeepAlive: Number(tmp.is_keep_alive) as 0 | 1, // 是否缓存  0不是  1是
                    isHide: tmp.is_hide, // 是否隐藏  0不是  1是
                    isAffix: tmp.is_affix, // 是否固定  0不是  1是
                    isIframe: tmp.is_iframe, // 是否内嵌  0不是  1是
                    icon: tmp.icon, // 菜单图标
                    sort: tmp.sort, // 菜单排序 （倒序）
                    menu_type: tmp.menu_type, // 菜单类型 1菜单  2按钮
                    created_at: tmp.created_at, // 创建时间
                    roles: ['admin'], // 权限
                },
                children: [],
            }
        }
        // 去除按钮
        if (tmp.menu_type !== 2) arr.push(obj)
        // }
    })
    return arr
}

/**
 * 路由过滤递归函数(去掉隐藏的路由)
 * @param routes
 * @returns
 */
export const filterHideRoutes = (routes: Array<string>) => {
    const arr: any = []
    routes.filter((item: any) => !item.meta.isHide)
        .forEach((val: any) => {
            // 这里可以做一些操作
            // val['title'] = val.meta.title;
            // val['id'] = val.meta.id;
            arr.push({ ...val })
            if (val.children) val.children = filterHideRoutes(val.children)
        })
    return arr
}

/**
 * 路由过滤，去掉组件没填的
 * @param menuList
 * @returns
 */
export const filterMenu = (menuList: any[]) => {
    return menuList.filter((item: any) => {
        // return menuCode.indexOf(item.code) > -1
        return item.component !== ''
    }).map((item: { children: any }) => {
        item = Object.assign({}, item)
        if (item.children) {
            item.children = filterMenu(item.children)
        }
        return item
    })
}

// 后端返回的路由转vue路由格式
export function formatLabel(routerArr: any[]) {
    const arr: LabelOption[] = []
    let obj: any = {}
    routerArr.forEach((router: any) => {
        const tmp = { ...router }

        // if (tmp.type == 1) {  //只筛选出type=1的项
        if (tmp.children) {
            tmp.children = formatLabel(tmp.children)
            // const { url, children, type } = router;
            obj = {
                value: tmp.meta.id,
                label: tmp.meta.title,
                children: tmp.children,
            }
        } else {
            obj = {
                value: tmp.meta.id,
                label: tmp.meta.title,
                children: [],
            }
        }
        arr.push(obj)
        // }
    })
    return arr
}
