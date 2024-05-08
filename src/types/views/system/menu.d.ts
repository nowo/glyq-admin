// import { RouteRecordRaw } from "vue-router";

// api接口  //////////////////////////
/**
 * 菜单列表 - 请求参数
 */
declare interface MenuApi_List extends ListPage {
    keyword?: string;     // 关键词搜索      示例值:
}

/**
 * 菜单列表 - 响应数据
 */
declare interface MenuApi_ListResponse extends ListTotal {
    list: MenuApi_MenuItem[]
}
declare interface MenuApi_MenuItem {
    "id": number,
    "p_id": 0,
    "icon": string,
    "href": "/",
    "sort": 0,
    "title": "首页",
    "title_en": "Home",
    "createdAt": "2023-08-30T09:25:44.210Z",
    "updatedAt": "2023-08-30T09:25:40.000Z",
    "children"?: MenuApi_MenuItem[],
}

/**
 * 新增（修改）菜单 - 请求参数
 */
declare interface MenuApi_Add {
    "p_id": number,
    "href": string,
    "sort": number,
    "title": string,
    "title_en": string,
    
    "icon"?: string,
}

/**
 * 修改菜单 - 请求参数
 */
declare interface MenuApi_Edit extends MenuApi_Add {
    id: number;    // 当前菜单id
}

/**
 * 权限菜单列表 - 响应数据
 */
declare interface MenuApi_ListAdminResponse {
    "menu": MenuApi_MenuItem[]
}

/**
 * 获取菜单显示数量 - 响应数据
 */
declare interface MenuApi_MenuNumberResponse {
    "id": number, //菜单id      41
    "num": number //数量        20
}












// 页面 ///////////////////////////////////////////////


declare interface MenuVueRouteItem {
    path: string,  // 菜单路径，用于跳转        /home
    name: string,    // 菜单 name，用于界面 keep-alive 路由缓存。此 name 需要与 component 组件中的 name 值相同（唯一）          home
    component: any,    // 组件路径          () => import('/@/views/home/index.vue')
    redirect: string,   //重定向        /HomeIndex
    meta: {// 附加自定义数据
        title: string,// 菜单标题
        isLink: string,             //菜单外链链接 开启外链条件，`1、isLink: true 2、链接地址不为空（meta.isLink） 3、isIframe: false`
        linkUrl: string,  //外链地址
        isHide: 0 | 1,// 菜单是否隐藏（菜单不显示在界面，但可以进行跳转）
        isKeepAlive: 0 | 1,// 菜单是否缓存
        isAffix: 0 | 1,// 菜单是否固定（固定在 tagsView 中，不可进行关闭），右键菜单无 `关闭` 项
        isIframe: 0 | 1,//是否内嵌 开启条件，`1、isIframe: true 2、链接地址不为空（meta.isLink）`
        // 当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
        // 之前 auth 取用户（角色下有多个用户）
        roles: ['admin', 'common'],
        icon: string,   //菜单图标              iconfont icon-home
        id: number,  //菜单id（唯一标识）
    },
    children: MenuVueRouteItem[]
}