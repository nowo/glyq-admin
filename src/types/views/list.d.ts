

/**
 * 轮播图列表 - 响应数据
 */
declare interface IBannerGetList extends ListPage {
    type: 1 | 2,   // 1:轮播图 2：友情链接
}


/**
 * 轮播图列表 - 响应数据
 */
declare interface IBannerGetListResponse extends ListTotal {
    list: {
        id: number,
        title: string,  // 标题
        title_en: string,  // 标题
        img: string; // 图片地址
        href: string; // 链接地址
        sort: number;    // 排序
        type: number;    // 类型 1:轮播图，2：友情链接
        isHide: boolean; //是否隐藏
    }[]
}

/**
 * 新增轮播图 - 请求参数
 */
declare interface IBannerAdd {

    title: string,  // 标题
    title_en: string,  // 标题
    img: string; // 图片地址
    href: string; // 链接地址
    sort: number;    // 排序
    isHide: boolean; //是否隐藏
    type: number;    // 类型 1:轮播图，2：友情链接
}


/**
 * 修改轮播图 - 请求参数
 */
declare interface IBannerEdit extends IBannerAdd {
    id: number;  // 轮播图ID
}



/**
 * 关于我们、联系我们 - 响应数据
 */
declare interface IOtherInfoResponse {

    id: number,
    title: string,  // 标题
    title_en: string,  // 标题
    img: string; // 图片地址

    content: string; // 内容
    content_en: string; // 内容

    type: number;    // 类型 1:关于我们，2：联系我们


}



/**
 * 修改关于我们、联系我们 - 请求参数
 */
declare interface IOtherInfoUpdate {

    // id?: number,
    title?: string,  // 标题
    title_en?: string,  // 标题
    img: string; // 图片地址

    content: string; // 内容
    content_en: string; // 内容

    type: number;    // 类型 1:关于我们，2：联系我们


}



/**
 * 新闻列表 - 请求参数
 */
declare interface INewsGetList extends ListPage {
    type: number;    // 类型
    title?: string;  // 标题
}

/**
 * 新闻列表 - 响应数据
 */
declare interface INewsGetListResponse extends ListTotal {
    list: {
        "id": 1,
        "title": "清洁度检测标准ISO16232和VDA",
        "title_en": "",
        "author": "tong",
        "describe": "检测目的：通过标准的方法来验证产品的清洁度品在装配时的紧密度,并且使产品的磨损老化加速。通过清洁度检测并规定其限值，可大大减轻颗粒磨损造......",
        "describe_en": "",
        "content": string
        "content_en": string
        "img": "http://localhost:9008/upload/2023/8/31/1693465126951cbycq5.png",
        "sort": 0,
        "isHide": boolean,
        "type": 1,
        "createdAt": "2023-08-31T06:59:35.000Z",
        "updatedAt": "2023-08-31T06:59:35.000Z"
    }[]
}

/**
 * 新闻列表 - 添加
 */
declare interface INewsAdd {

    title: string,  // 标题
    title_en?: string,  // 标题
    img: string; // 图片地址
    author?: string;  // 作者
    describe: string; //简介
    describe_en: string; //简介

    content: string; // 内容
    content_en: string; // 内容

    isHide: boolean; //是否首页显示
    sort: number;    // 排序

    type: number;    // 类型 1:新闻
    read: number;  // 阅读量
}

/**
 * 新闻列表 - 修改
 */
declare interface INewsEdit extends INewsAdd {
    id: number
}







/**
 * 产品列表 - 请求参数
 */
declare interface IGoodsGetList extends ListPage {
    type?: number | '';    // 类型
    title?: string;  // 标题
}

/**
 * 产品列表 - 响应数据
 */
declare interface IGoodsGetListResponse extends ListTotal {
    list: {
        "id": 1,
        "title": "清洁度检测标准ISO16232和VDA",
        "title_en": "",
        "author": "tong",
        "describe": "检测目的：通过标准的方法来验证产品的清洁度品在装配时的紧密度,并且使产品的磨损老化加速。通过清洁度检测并规定其限值，可大大减轻颗粒磨损造......",
        "describe_en": "",
        "content": string
        "content_en": string
        "img": "http://localhost:9008/upload/2023/8/31/1693465126951cbycq5.png",
        "sort": 0,
        "isHide": boolean,
        "type": 1,
        "createdAt": "2023-08-31T06:59:35.000Z",
        "updatedAt": "2023-08-31T06:59:35.000Z",
        read: number
    }[]
}



