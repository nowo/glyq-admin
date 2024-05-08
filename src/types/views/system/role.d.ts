


/**
 * 获取角色列表 - 请求参数
 */
declare interface RoleApi_GetList extends ListPage {
    keyword?: string;     // 角色名称      示例值:超级
    role_code?: string;     // 角色标识      示例值:
    status?: number|'';     // 角色状态  1开启 2关闭      示例值:
    role_desc?: string;     // 描述      示例值:
}

/**
 * 获取角色列表 - 响应数据
 */
declare interface RoleApi_GetListResponse extends ListTotal {
    "list": {
        "id": 1, //管理员ID
        "role_name": "超级管理员", //角色名称
        "role_code": "admin", //角色标识
        "menu_list": "1,2,4,5,6,7,8", //权限菜单ID
        "role_desc": "超级管理员", //角色描述
        "status": 1, //状态 0禁用 1开启
        "created_at": "2022-06-25 16:31:20" //创建时间
    }[]
}



/**
 * 新增角色 - 请求参数
 */
declare interface RoleApi_Add {
    role_name: string;     // 角色名称      示例值:财务
    role_code: string;     // 角色标识      示例值:finance
    role_desc: string;     // 角色描述      示例值:财务人员
    status: 0 | 1;     // 状态 0禁用 1开启      示例值:1
    menu_id: string;     // 有权限的菜单ID      示例值:1,2,4,5,6,7,8
}

/**
 * 修改角色 - 请求参数
 */
declare interface RoleApi_Edit extends RoleApi_Add {
    role_id: number;
}