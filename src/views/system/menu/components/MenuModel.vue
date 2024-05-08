<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="40%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <!-- <el-tabs v-model="lang" class="-mt15px">
                <el-tab-pane label="中文" name="cn" />
                <el-tab-pane label="英文" name="en" />
            </el-tabs> -->

            <el-form-item label="上级菜单" prop="p_id">
                <my-cascader v-model="form.data.p_id" class="w100%" :options="defData.routeArr"
                    :props="{ checkStrictly: true, value: 'id', label: 'title', disabled: 'disabled' }"
                    placeholder="请选择上级菜单" />
            </el-form-item>
            <el-form-item label="菜单名称" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入菜单名称" clearable />
            </el-form-item>

            <el-form-item label="英文菜单名称" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="30" placeholder="请输入英文菜单名称" clearable />
            </el-form-item>
            <el-form-item label="链接地址" prop="href">
                <el-input v-model="form.data.href" maxlength="200" placeholder="" clearable
                    :disabled="defData.type === 2" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item>
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { MainPage } from '@/router/layout'
import { deepClone } from '@/utils/other'
import { getParentId, setDisableTree } from '@/utils/common/tree'
import { formErrorMessage, verifyFormData } from '@/utils/element/form'
import { MenuApi } from '@/api/system/menu'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'

const props = defineProps<{
    data: MenuApi_MenuItem[]
}>()

const emits = defineEmits<{
    update: []
}>()

const lang = ref<LanguageType>('cn')
const defData = reactive({
    visible: false, // 弹窗显示
    menuData: [], // 上级菜单数据
    ready: false,
    routeArr: [] as MenuApi_MenuItem[],
    type: 1,
})
const formRef = ref<FormInstance>()

const form = reactive({
    data: {
        id: 0,
        p_id: '' as '' | number, //
        title: '', // 菜单名称
        title_en: '', // 菜单名称（英文）
        href: '', // 链接地址
        sort: 0, // 排序

    },
})

const rules = reactive<FormRules>({
    title: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    title_en: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    name: [
        { required: true, pattern: /^[0-9a-zA-Z]+$/, message: '只能输入数字和英文', trigger: 'blur' },
    ],
    href: [
        // { required: true, pattern: /^(\/([A-Za-z0-9_-]*))+$/, message: '以/开头,后面为字母或数字,不能有空格', trigger: 'blur' },
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],

})

const comData = computed(() => {
    if (defData.type === 1) return { title: '新增菜单' }
    return { title: '修改菜单' }
})

const initDefaultData = async () => {
    if (defData.ready) return

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: MenuApi_MenuItem | number) => {
    let arr = deepClone(props.data)

    if (typeof row === 'number' || typeof row === 'undefined') { // 新增
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.title_en = ''
        form.data.href = ''
        form.data.sort = 0

        form.data.p_id = typeof row === 'number' ? row : ''
    } else if (row) { // 修改
        const list = setDisableTree(arr, row.id, 'id', 'children')
        arr = list

        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.title_en = row.title_en
        form.data.href = row.href
        form.data.sort = row.sort
        form.data.p_id = row.p_id || ''
    }

    defData.routeArr = arr

    await initDefaultData()
    defData.visible = true
}

const [ApiFunc, btnLoading] = useLoadingSubmit()

const onReset = () => {
    formRef.value?.resetFields() // 清空表单
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    onReset()
}

// 确定
const onConfirm = useThrottleFn(async () => {
    const isRun = await verifyFormData(formRef.value)
    if (!isRun) return

    const data: MenuApi_Add = {
        p_id: Number(form.data.p_id),
        href: form.data.href?.trim() ?? '',
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
    }

    if (defData.type === 1) {
        const res = await ApiFunc(MenuApi.add(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: MenuApi_Edit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(MenuApi.edit(param))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('修改成功')
    }

    emits('update') // 重新加载列表
    onClose() // 关闭弹窗
}, 800)

// 页面加载时
onMounted(async () => {

})

defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped></style>
