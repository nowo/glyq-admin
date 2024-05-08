<template>
    <el-form ref="formRef" :model="form.data" :rules="rules" class="p20px" label-position="top">
        <!-- <el-tabs v-model="lang">
            <el-tab-pane label="中文" name="cn" />
            <el-tab-pane label="英文" name="en" />
        </el-tabs> -->
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="16" class="mb18px">
                <el-form-item prop="img" label="图片：">
                    <UploadFile v-model="form.data.img" />
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="16" class="mb18px">
                <el-form-item prop="content" label="描述信息：">
                    <BaseWangEditor v-model="form.data.content" />
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="16" class="mb18px">
                <el-form-item prop="content_en" label="英文描述信息：">
                    <BaseWangEditor v-model="form.data.content_en" />
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb18px">
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="onSubmit">
                        确定
                    </el-button>
                    <el-button @click="resetForm">
                        重置
                    </el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getOtherInfo, setOtherInfoUpdate } from '@/api/list'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'

const props = defineProps<{
    data?: SystemCompanyApi_GetInfoResponse
}>()

const lang = ref<LanguageType>('cn')

const formRef = ref<FormInstance>()

const defData = reactive({
    ready: false,
})

const form = reactive({

    data: {
        title: '', // 标题
        title_en: '',
        content: '', // 公司地址
        content_en: '', // 公司地址
        img: '', // 图片
        type: 1,

    },

})

const rules = reactive<FormRules>({

    company: [{ required: true, whitespace: true, message: '请输入公司名称', trigger: 'blur' }],
})

// 初始化数据
const initDefaultData = async () => {
    if (defData.ready) return

    const res = await getOtherInfo({ type: form.data.type })
    if (res.code !== 200) return ElMessage.error(res.msg)
    form.data.title = res.data?.title ?? ''
    form.data.title_en = res.data?.title_en ?? ''
    form.data.content = res.data?.content ?? ''
    form.data.content_en = res.data?.content_en ?? ''
    form.data.img = res.data?.img ?? ''
    defData.ready = true
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 确定
const onSubmit = async () => {
    const param: IOtherInfoUpdate = {
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        content: form.data.content?.trim() ?? '',

        content_en: form.data.content_en?.trim() ?? '',
        img: form.data.img?.trim() ?? '',
        type: form.data.type,
    }

    const res = await ApiFunc(setOtherInfoUpdate(param))
    if (res.code !== 200) return ElMessage.error(res.msg)
    // const res = await ShopBaseApi.getBasicInf(data)
    // if (res.code != 200) return ElMessage.error(res.msg)
    ElMessage.success('设置成功')

    // initData?.() // 更新数据
}
// 重置
const resetForm = async () => {
    // formRef.value?.resetFields();
    initDefaultData()
}

// 监听，
watch(() => props.data, (newVal) => {
    initDefaultData()
})

onBeforeMount(() => {
    initDefaultData()
})
</script>

<style lang="scss" scoped></style>
