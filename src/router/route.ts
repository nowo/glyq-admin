import type { RouteRecordRaw } from 'vue-router'

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `@/views/system/menu/components/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
/// / ****
export const dynamicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '/',
        component: () => import('@/layout/index.vue'),
        redirect: '/home',
        // @ts-expect-error 正确meta
        meta: {
            isKeepAlive: true,
        },
        children: [
            {
                path: '/home',
                name: 'HomeIndex',
                component: () => import('@/views/home/HomeIndex.vue'),
                meta: {
                    id: 1,
                    title: '首页装修',
                    isLink: false, // 是否使用外链
                    linkUrl: '', // 外链
                    isHide: false, // 是否隐藏
                    isKeepAlive: true,
                    isAffix: true,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'iconfont icon-home',
                },
            },
            {
                path: '/goods',
                name: 'GoodsList',
                component: () => import('@/views/goods/GoodsList.vue'),
                meta: {
                    id: 2023032402,
                    title: '产品列表',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Menu',
                },
            },
            {
                path: '/news',
                name: 'NewsList',
                component: () => import('@/views/news/NewsList.vue'),
                meta: {
                    id: 2023032402,
                    title: '新闻资讯',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Menu',
                },
            },
            {
                path: '/case',
                name: 'NewsCase',
                component: () => import('@/views/news/NewsCase.vue'),
                meta: {
                    id: 2023032402,
                    title: '客户案例',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Menu',
                },
            },
            {
                path: '/mien',
                name: 'NewsCompany',
                component: () => import('@/views/news/NewsCompany.vue'),
                meta: {
                    id: 2023032402,
                    title: '公司风采',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Menu',
                },
            },
            {
                path: '/technical',
                name: 'NewsTechnical',
                component: () => import('@/views/news/NewsTechnical.vue'),
                meta: {
                    id: 2023032402,
                    title: '技术支持',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Menu',
                },
            },
            {
                path: '/menu',
                name: 'SystemMenu',
                component: () => import('@/views/system/menu/SystemMenu.vue'),
                meta: {
                    id: 2023032402,
                    title: '网站菜单',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Memo',
                },
            },
            {
                path: '/user',
                name: 'SystemUser',
                component: () => import('@/views/system/user/SystemUser.vue'),
                meta: {
                    id: 2023032402,
                    title: '系统用户',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-User',
                },
            },
            {
                path: '/setting',
                name: 'BaseSet',
                component: () => import('@/views/base/BaseSet.vue'),
                meta: {
                    id: 2023032402,
                    title: '网站设置',
                    isLink: false,
                    linkUrl: '',
                    isHide: false,
                    isKeepAlive: true,
                    isAffix: false,
                    isIframe: false,
                    roles: ['admin', 'common'],
                    icon: 'ele-Setting',
                },
            },

        ],
    },
]
/// / ****

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
    {
        path: '/:path(.*)*',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
            id: 's404',
            title: '404',
            isHide: true,
        },
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401.vue'),
        meta: {
            id: 's401',
            title: '401',
            isHide: true,
        },
    },
]

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: '/',
        component: () => import('@/layout/index.vue'),
        // @ts-expect-error 正确meta
        meta: {
            title: '布局界面',
        },
        // @ts-expect-error 正确meta
        children: [
            // 请不要往这里 `children` 中添加内容，此内容为了防止 No match found for location with path "xxx" 问题
            ...notFoundAndNoPower,
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        // @ts-expect-error 正确meta
        meta: {
            title: '登录',
        },
    },
]
