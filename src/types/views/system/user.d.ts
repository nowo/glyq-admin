
/**
 * 获取员工列表 - 请求参数
 */
declare interface UserApi_GetList extends ListPage {

    username?: string;  // 用户名
    account?: string;   // 登录账号
    status?: number | ''; // 是否启用
}




/**
 * 获取员工列表 - 响应数据
 */
declare interface UserApi_GetListResponse extends ListTotal {
    list: {
        "id": 1,
        "account": "admin",
        "username": "admin",
        "password": "",
        "avatar": "123456",
        "status": 1,
        "createdAt": "2023-08-03T10:38:13.992Z",
        "updatedAt": "2023-08-03T10:38:10.000Z"
    }[]
}



/**
 * 员工 - 新增 - 请求参数
 */
declare interface UserApi_Add {
    username: string;  // 用户名
    account: string;   // 登录账号
    password: string;  // 登录密码
    status: number; // 是否启用
}

/**
 * 员工 - 修改 - 请求参数
 */
declare interface UserApi_Edit extends Omit<UserApi_Add, 'password'> {
    id: number;     // 用户id
    password?: string;     // 密码      示例值:88888888
}

/**
 * 修改密码
 */
declare interface UserApi_EditPassword {
    password: string;
    newPassword: string;
}







/**
 * 获取管理员信息(当前登录用户) - 响应数据
 */
declare interface UserApi_GetAdminResponse {
    id: number;
    username: string;
    account: string;
    avatar: string;
    status: number;
}


/**
 * 用户信息
 */
declare interface UserAdminInfo extends UserApi_GetAdminResponse {

    "id": number,
    "account": string,
    "username": string,
    "avatar": string,
    "status": number,
    photo: string,
    time: string | number,
    roles: string[],
    authBtnList: string[],
}

/**
 * 获取管理员权限菜单 - 响应数据
 */
declare interface UserApi_GetMenuResponse {
    "menu": UserApi_GetMenuItem[]

}

declare interface UserApi_GetMenuItem {
    "id": 1, //菜单ID
    "pid": 0, //上级菜单
    "title": "订单管理", //菜单名称
    "level": 1, //菜单层级
    "page_path": "", //视图路径
    "route_path": "/order", //路由路径
    "route_name": "orderIndex", //路由名称
    "redirect": "/order/list", //重定向路径
    "is_link": 0, //是否外链  0不是  1是
    "link_url": "", //外链地址
    "is_hide": 0, //是否隐藏  0不是  1是
    "is_affix": 0, //是否固定  0不是  1是
    "is_iframe": 0, //是否内嵌  0不是  1是
    "icon": "fa fa-file-text", //菜单图标
    "sort": 1, //菜单排序 （倒序）
    "menu_type": 1, //菜单类型 1菜单  2按钮
    "created_at": "2022-06-23 02:12:39", //创建时间
    "children": UserApi_GetMenuItem[]
}




/**
 * 管理员关联的用户会员 - 请求参数
 */
declare interface UserApi_GetBindList extends ListPage {
    id: number;  // 管理员id
}

/**
 * 管理员关联的用户会员 - 请求参数
 */
declare interface UserApi_GetBindListResponse extends ListTotal {
    "lists": {
        "user_id": 2, //用户id
        "user_name": "张三", //用户名称
        "phone": "13410985006" //手机号
    }[],
}



/**
 * 操作日志 - 请求参数
 */
declare interface SystemLogApi_GetList extends ListPage {
    start_time?: string;  // 搜索项：开始时间    2022-08-12 20:07:54
    end_time?: string;    // 搜索项：结束时间    2023-09-12 20:07:54
    name: string;    // 管理员名称
}



/**
 * 操作日志 - 响应数据
 */
declare interface SystemLogApi_GetListResponse extends ListTotal {
    "lists": {
        "realname": "admin", //管理员名称
        "ip": "127.0.0.1", //IP地址
        "path": "api/goods/edit", //接口
        "log": "修改商品", //日志记录
        "created_at": "2023-05-13 11:31:10" //创建时间
    }[]
}