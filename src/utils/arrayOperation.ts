/**
 * 判断两数组字符串是否相同（用于按钮权限验证），数组字符串中存在相同时会自动去重（按钮权限标识不会重复）
 * @param newArr 新数据
 * @param oldArr 源数据
 * @returns 两数组相同返回 `true`，反之则反
 */
export function judgmentSameArr(newArr: unknown[] | string[], oldArr: string[]): boolean {
    const news = removeDuplicate(newArr)
    const olds = removeDuplicate(oldArr)
    let count = 0
    const len = olds.length
    for (const i in olds) {
        for (const j in news) {
            if (olds[i] === news[j]) count++
        }
    }
    return count === len
}

/**
 * 判断两个对象是否相同
 * @param a 要比较的对象一
 * @param b 要比较的对象二
 * @returns 相同返回 true，反之则反
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
    if (!a || !b) return false
    const aProps = Object.getOwnPropertyNames(a)
    const bProps = Object.getOwnPropertyNames(b)
    if (aProps.length != bProps.length) return false
    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i]
        const propA = a[propName]
        const propB = b[propName]
        if (!b.hasOwnProperty(propName)) return false
        if (propA instanceof Object) {
            if (!isObjectValueEqual(propA, propB)) return false
        } else if (propA !== propB) {
            return false
        }
    }
    return true
}

/**
 * 数组、数组对象去重
 * @param arr 数组内容
 * @param attr 需要去重的键值（数组对象）
 * @returns
 */
export function removeDuplicate(arr: any, attr?: string) {
    if (!arr && !arr.length) {
        return arr
    } else {
        if (attr) {
            const obj: any = {}
            const newArr = arr.reduce((cur: any, item: any) => {
                obj[item[attr]] ? '' : (obj[item[attr]] = true && item[attr] && cur.push(item))
                return cur
            }, [])
            return newArr
        } else {
            return Array.from(new Set([...arr]))
        }
    }
}
