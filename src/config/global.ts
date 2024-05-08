// 一些静态变量，可能多个组件会用到这个变量

// 角色标识
export const USER_ROLE = {
    root: 'super_admin', // 超级管理员
    sale: 'salesman',    // 业务员
    purchase: 'purchase',    // 采购
    finance: 'finance',    // 财务
    supplier: 'supplier',    // 供应商
    warehouse: 'warehouse',    // 仓管
    company_admin: 'company_admin',    // 管理员
}

/**
 * 全局默认分页设置
 */
export const PAGINATION = {
    page: 1,    // 当前页面
    page_size: 20,  //每页显示的数量
    page_sizes: [20, 50, 100, 200, 500],
    total: 0
}


/**
 * 发票类型
 */
export const INVOICE_DATA = {  // 发票类型 1：增值税专用发票，2：普通发票， 3：电子普通发票
    1: '增值税专用发票',
    2: '普通发票',
    3: '电子普通发票',
}

