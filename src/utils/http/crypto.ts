import md5 from 'md5'
import { encode } from 'js-base64'
import Crypto from 'crypto-js'

// import { $fetch, FetchOptions } from 'ofetch'

const { MD5 } = Crypto

// 对象数组排序，并用&拼接
export function raw(args: { [x: string]: any }) {
    let keys = Object.keys(args)
    keys = keys.sort()
    const newArgs: any = {}
    keys.forEach((key) => {
        newArgs[key] = args[key]
        // newArgs[key.toLowerCase()] = args[key];
    })

    let string = ''
    for (const k in newArgs) {
        // console.log(newArgs[k] instanceof Object);
        let val = newArgs[k]
        if (newArgs[k] instanceof Object) {
            val = JSON.stringify(newArgs[k])
        }
        string += `${k}=${val}&`
    }

    // string = string.substring(1)

    return string
}

// 接口加密
export function crypto<T>(obj: T & { sign?: string; time?: number }) {
    // 密钥
    // let keys = "58402683605729e494da882524d1fe12";
    const keys = import.meta.env.VITE_SIGN_KEY
    if (!keys) return false

    // 原有data已经存在sign，time这两个字段时，删除这两个字段后在加密
    if (obj.sign) delete obj.sign
    if (obj.time) delete obj.time

    const time = ~~(new Date().getTime() / 1000) // 取得时间戳，并转成10位

    const newData = { ...obj, time }

    const str = raw(newData) // 按键值排序，并用&符号连接

    const baseStr = encode(str) // base64加密
    const newStr = keys + baseStr + keys
    const sign = md5(newStr) // md5加密

    return { ...newData, sign }
}

/**
 * 签名加密 加密规则： 密钥+拼接字符串进行MD5加密
 * @param {string} secret  待加密的密钥
 * @param {string} str 用于混入密钥的字符串（一般用时间戳）
 * @returns 加密后的字符串
 * @example
 * ```javascript
 * setSignRule('0eb948223412170b5', new Date().getTime().toString())    // 0eb948223412170b50de9bb356d39e2b
 * ```
 */
export const setSignRule = (secret: string, str: string) => {
    // 第一次加密 （密钥+拼接字符串）进行MD5加密
    const key = secret + str
    const s = MD5(key).toString()
    // 第二次加密 (加密一次后的密钥取前面20个字符+拼接字符串取前面10个字符)进行MD5加密
    const key1 = s.substring(0, 20) + str.substring(0, 10)
    const s1 = MD5(key1).toString()

    return s1
}
