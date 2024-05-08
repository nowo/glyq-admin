<template>
    <co-drawer v-model:visible="defData.visible" :loading="btnLoading" auto-height hidden :title="comData.title" size="30%"
        @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <!-- class="dialog-flex" -->
        <el-form ref="formRef" class="pr5px" :model="form.data" :rules="rules" label-width="85px">
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="form.data.name" class="w100%" placeholder="请输入用户名称" maxlength="20" clearable />
            </el-form-item>

            <el-form-item label="登录账号" prop="account">
                <el-input v-model="form.data.account" class="w100%" placeholder="请输入登录账号" maxlength="20" clearable />
            </el-form-item>

            <el-form-item v-if="defData.type === 1" label="登录密码" prop="password">
                <el-input v-model="form.data.password" class="w100%" placeholder="请输入登录密码" maxlength="20" clearable
                    show-password />
            </el-form-item>
            <el-form-item v-else label="登录密码" prop="new_password">
                <el-input v-model="form.data.new_password" class="w100%" placeholder="请输入登录密码" maxlength="20" show-password
                    clearable />
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-switch v-model="form.data.status" inline-prompt active-text="启" inactive-text="禁" :active-value="1"
                    :inactive-value="2" />
            </el-form-item>
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'

import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { verifyFormData } from '@/utils/element/form'
import { UserApi } from '@/api/system/user'

const emits = defineEmits<{
    update: []
}>()

const formRef = ref<FormInstance>()

const defData = reactive({
    visible: false,
    ready: false,
    type: 1, // 1:新增，2：修改

})

const comData = computed(() => {
    if (defData.type === 1) return { title: '新增用户' }
    return { title: '修改用户' }
})

const form = reactive({
    data: {
        id: 0, // 角色id
        name: '', // 名称
        account: '', // 账号
        password: '', // 密码
        // role_id: '' as '' | number, // 所属角色
        // phone: '', // 手机号码
        status: 1, // 状态 2禁用 1开启
        new_password: '', // 新密码
    },
})

const rules = reactive<FormRules>({
    name: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    account: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入数字和英文', trigger: 'blur' },
        { min: 2, max: 16, message: '最少2个,最多16个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
    ],
    new_password: [
        { pattern: /^[^\u4E00-\u9FA5 ]{6,16}$/, message: '不含有中文和空格,至少6位,最多16位', trigger: 'blur' },
    ],
    role_id: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
        // { required: true, pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
})

// 初始化数据
const initDefaultData = async () => {
    if (defData.ready) return

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: UserApi_GetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.name = row.username// 名称
        form.data.account = row.account// 账号
        form.data.status = row.status// 状态
        form.data.password = ''
        form.data.new_password = ''
    } else { // 新增
        defData.type = 1
        form.data.id = 0
        form.data.name = ''// 名称
        form.data.account = ''// 账号
        form.data.status = 1 // 状态
        form.data.password = ''
    }

    await initDefaultData()

    defData.visible = true
}

const onReset = () => {
    formRef.value?.resetFields() // 清空表单
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    onReset()
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 确定
const onConfirm = useThrottleFn(async () => {
    const isRun = await verifyFormData(formRef.value)
    if (!isRun) return

    const data: UserApi_Add = {
        account: form.data.account.trim(),
        password: form.data.password.trim(),
        username: form.data.name.trim(),
        status: form.data.status,
    }

    if (defData.type === 1) {
        const res = await ApiFunc(UserApi.add(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: UserApi_Edit = {
            ...data,
            id: form.data.id,
        }
        // 是否填了密码
        if (form.data.new_password) {
            param.password = form.data.new_password
        }

        const res = await ApiFunc(UserApi.edit(param))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('修改成功')
    }

    emits('update') // 重新加载列表
    onClose() // 关闭弹窗
}, 800)

// 页面加载时
onMounted(() => {
    // initDefaultData();
})

defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped></style>
