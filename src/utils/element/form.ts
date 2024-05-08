import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { formatTime } from '../common/formatTime'

export const formErrorMessage = (fields: any) => {
    const obj: any = fields
    const firstKey = Object.keys(obj)[0]
    const text = obj[firstKey][0].message
    ElMessage.error(text)
    return false
}

/**
 * 验证el-form组件
 * @param formEl
 * @returns
 */
export const verifyFormData = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        ElMessage.error('未获取到对应的组件,formEl为空')
        return false
    }
    return await formEl.validate((valid, fields) => {
        if (valid) {
            return true
        } else {
            const obj: any = fields
            const firstKey = Object.keys(obj)[0]
            const text = obj[firstKey][0].message
            ElMessage.error(text)
            return false
        }
    })
}

/**
 * 获取当前月份开始时间和当前时间
 * @returns
 */
export const formMonthDate = (): [string, string] => {
    const data = new Date()
    data.setDate(1)
    data.setHours(0)
    data.setSeconds(0)
    data.setMinutes(0)
    const start = formatTime(data.getTime())
    const end = formatTime(new Date().getTime())
    return [start, end]
}
