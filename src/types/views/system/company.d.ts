


// 公司信息
declare interface SystemCompanyApi_GetInfoResponse {
    "id": 1,
    "title": "洛泰精密仪器（东莞）有限公司",
    "address": "广东省东莞市虎门镇太安路虎门段41号泰明商业大厦2栋",
    "logo": "1",
    "logo2": null,
    "qrCode": null,
    "phone": "189-2553-8915",
    "email": null,
    "keyword": null,
    "description": null,
    "filing": null,
    "copyright": null,
    "createdAt": "2023-08-28T11:28:07.677Z",
    "updatedAt": "2023-08-28T11:28:05.000Z",
    "title_en": "Shengyin Intelligent Technology (Shenzhen) Co., LTD",
    "address_en": "18F, Building A, Yunzhi Technology Park, South of Shuangming Avenue, Dongzhou Community, Guangming Street, Guangming District, Shenzhen, Guangdong   ",
    "filing_en": null,
    "copyright_en": null,
    icon:string
}



// 系统信息
declare interface ISystemEditParams{

    title: string, // 公司名称
    address: string, // 公司地址

    title_en: string,
    address_en: string, // 公司地址

    phone: string, // 公司电话
    email: string, // 公司邮箱


    logo: string, // 网站logo
    logo2: string, // 网站logo
    qr_code: string, // 二维码

    seo_keyword: string, // 关键词
    seo_description: string, // 描述

    filing: string, // 备案号
    copyright: string, // 版权信息
    filing_en: string, // 备案号
    copyright_en: string, // 版权信息
    icon:string, // 网站图标
}


declare interface ICompanyEditParams{

    company: string, // 公司名称
    address: string, // 公司地址

    company_en: string,
    address_en: string, // 公司地址

    phone: string, // 公司电话
    email: string, // 公司邮箱


    logo: string, // 网站logo
    logo2: string, // 网站logo
    qr_code: string, // 二维码

    seo_keyword: string, // 关键词
    seo_description: string, // 描述

    filing: string, // 备案号
    copyright: string, // 版权信息
    filing_en: string, // 备案号
    copyright_en: string, // 版权信息
}
