<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="40%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入标题" clearable />
            </el-form-item>

            <el-form-item label="英文标题" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="30" placeholder="请输入英文标题" clearable />
            </el-form-item>

            <el-form-item label="图片" prop="img">
                <UploadFile v-model="form.data.img" />
            </el-form-item>

            <el-form-item label="链接地址" prop="href">
                <el-input v-model="form.data.href" maxlength="200" placeholder="" clearable />
            </el-form-item>

            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item>
            <el-form-item label="是否隐藏" prop="isHide">
                <el-radio-group v-model="form.data.isHide">
                    <el-radio :label="true">
                        是
                    </el-radio>
                    <el-radio :label="false">
                        否
                    </el-radio>
                </el-radio-group>
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
import { setBannerAdd, setBannerUpdate } from '@/api/list'

const props = defineProps<{
    type: 1 | 2
    title: string
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
        title: '', // 菜单名称
        title_en: '', // 菜单名称（英文）
        href: '', // 链接地址
        sort: 0, // 排序
        img: '', // 图片地址
        isHide: false, // 是否隐藏
    },
})

const rules = reactive<FormRules>({
    title: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    title_en: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],

    href: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    img: [
        // { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})

const comData = computed(() => {
    if (defData.type === 1) return { title: `新增${props.title}` }
    return { title: `修改${props.title}` }
})

const initDefaultData = async () => {
    if (defData.ready) return

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: IBannerGetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.title_en = row.title_en
        form.data.href = row.href
        form.data.sort = row.sort
        form.data.img = row.img
    } else {
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.title_en = ''
        form.data.href = ''
        form.data.sort = 0
        form.data.img = ''
    }

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

    const data: IBannerAdd = {
        href: form.data.href?.trim() ?? '',
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        img: form.data.img?.trim() ?? '',
        isHide: form.data.isHide,
        type: props.type,
    }

    if (defData.type === 1) {
        const res = await ApiFunc(setBannerAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IBannerEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setBannerUpdate(param))
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

<style lang="scss" scoped>
.comp-box {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;

    em {
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }
}
</style>
