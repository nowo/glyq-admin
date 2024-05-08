import { get, post } from '@/utils/http/request'

/**
 * 公共api
 * @method upload 文件上传
 * @method delImg 删除图片
 */
export const CommonApi = {

    /**
     * 上传图片
     * @returns
     */
    upload: (data: { file: File }) => post<string>('/api/common/upload', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
    }),

    // upload: (data: { file: File }) => post<string>('/api/common/test', data, {
    //     // headers: {
    //     //     'Content-Type': 'multipart/form-data',
    //     // },
    //     timeout: 60000,
    // }),

    /**
     * 上传图片
     * 上传类型：image=>图片（默认） ，excel=>excel文件, voiv : 视频
     * @returns
     */
    uploadImg: (data: { image: File; type?: 'image' | 'excel' | 'voiv' }) => post('/api/common/upload_image', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
    }),

    /**
     * 删除图片
     * @returns
     */
    delImg: (data: { src: string }) => post('/api/common/delete_image', data),

    /**
     * 清除后端缓存
     * @returns
     */
    clear: () => get('/api/common/clear_cache'),

}
