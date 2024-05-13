import { post } from '@/utils/http/request'

// 获取轮播图列表
export const getBannerList = (data?: IBannerGetList) => post<IBannerGetListResponse>('/api/v1/banner/get_list', data)
// 添加轮播图
export const setBannerAdd = (data: IBannerAdd) => post('/api/v1/banner/add', data)
// 修改轮播图
export const setBannerUpdate = (data: IBannerEdit) => post('/api/v1/banner/edit', data)
// 删除轮播图
export const setBannerDelete = (data: { id: number }) => post('/api/v1/banner/delete', data)

// 、、、   ///
// 获取商品列表
export const getGoodsList = (data?: IGoodsGetList) => post<IGoodsGetListResponse>('/api/v1/product/get_list', data)
// 添加商品
export const setGoodsAdd = (data: INewsAdd) => post('/api/v1/product/add', data)
// 修改商品
export const setGoodsUpdate = (data: INewsEdit) => post('/api/v1/product/edit', data)
// 删除商品
export const setGoodsDelete = (data: { id: number }) => post('/api/v1/product/delete', data)

// 获取关于我们、联系我们信息
export const getOtherInfo = (data: { type: number }) => post<IOtherInfoResponse | null>('/api/v1/other/info', data)
// 更新关于我们、联系我们信息
export const setOtherInfoUpdate = (data: IOtherInfoUpdate) => post('/api/v1/other/edit', data)

// 、、、   ///
// 获取新闻列表
export const getNewsList = (data?: INewsGetList) => post<INewsGetListResponse>('/api/v1/news/get_list', data)
// 添加新闻
export const setNewsAdd = (data: INewsAdd) => post('/api/v1/news/add', data)
// 修改新闻
export const setNewsUpdate = (data: INewsEdit) => post('/api/v1/news/edit', data)
// 删除新闻
export const setNewsDelete = (data: { id: number }) => post('/api/v1/news/delete', data)
