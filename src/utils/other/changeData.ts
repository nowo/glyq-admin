/**
 * 前台跳转地址设置
 * @param {string} url  跳转的地址或页面名称
 * @returns
 */
export const setHomeUrl = (url?: string) => {
    let host = import.meta.env.VITE_HOME_URL
    if (!url) return host
    // 以/开头的URL处理，以/结尾的URL不做处理。
    const startReg = /^\//
    const endReg = /\/$/

    host = endReg.test(host) ? host : `${host}/`

    const newUrl = startReg.test(url) ? url.substring(1) : url

    return host + newUrl
}
