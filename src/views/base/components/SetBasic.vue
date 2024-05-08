<template>
    <el-form ref="formRef" :model="form.data" :rules="rules" class="pl30px" label-position="top">
        <el-tabs v-model="lang">
            <el-tab-pane label="中文" name="cn" />
            <el-tab-pane label="英文" name="en" />
        </el-tabs>
        <el-row>
            <template v-if="lang === 'cn'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="company" label="公司名称：">
                        <el-input v-model="form.data.company" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="address" label="公司地址：">
                        <el-input v-model="form.data.address" type="textarea" maxlength="200" clearable show-word-limit />
                    </el-form-item>
                </el-col>
            </template>
            <template v-else-if="lang === 'en'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="company_en" label="英文公司名称：">
                        <el-input v-model="form.data.company_en" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="address_en" label="英文公司地址：">
                        <el-input v-model="form.data.address_en" type="textarea" maxlength="200" clearable
                            show-word-limit />
                    </el-form-item>
                </el-col>
            </template>

            <el-col :xs="24" :sm="24" :md="18" :lg="12" :xl="10" class="mb18px">
                <el-form-item prop="phone" label="联系方式：">
                    <el-input v-model="form.data.phone" maxlength="50" clearable />
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="seo_keyword" label="SEO关键字：">
                    <el-input v-model="form.data.seo_keyword" maxlength="80" clearable />
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="seo_description" label="SEO描述：">
                    <el-input v-model="form.data.seo_description" type="textarea" show-word-limit maxlength="150"
                        clearable />
                </el-form-item>
            </el-col>

            <template v-if="lang === 'cn'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="filing" label="备案号：">
                        <el-input v-model="form.data.filing" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="copyright" label="版权信息：">
                        <el-input v-model="form.data.copyright" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="lang === 'en'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="filing_en" label="英文备案号：">
                        <el-input v-model="form.data.filing_en" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="copyright_en" label="英文版权信息：">
                        <el-input v-model="form.data.copyright_en" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
            </template>

            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="logo" label="网站logo：">
                    <UploadFile v-model="form.data.logo" />
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="logo2" label="网站logo2：">
                    <UploadFile v-model="form.data.logo2" />
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="icon" label="网站图标：">
                    <UploadFile v-model="form.data.icon" />
                </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="qr_code" label="二维码：">
                    <UploadFile v-model="form.data.qr_code" />
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
import { setSystemInfo } from '@/api/system'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'

const props = defineProps<{
    data?: SystemCompanyApi_GetInfoResponse
}>()

const lang = ref<LanguageType>('cn')

const formRef = ref<FormInstance>()
const form = reactive({

    data: {
        company: '', // 公司名称
        address: '', // 公司地址

        company_en: '',
        address_en: '', // 公司地址

        phone: '', // 公司电话
        email: '', // 公司邮箱

        logo: '', // 网站logo
        logo2: '', // 网站logo
        qr_code: '', // 二维码
        seo_keyword: '', // 关键词
        seo_description: '', // 描述

        filing: '', // 备案号
        copyright: '', // 版权信息
        filing_en: '', // 备案号
        copyright_en: '', // 版权信息

        icon: '', // 网站图标
    },

})

const rules = reactive<FormRules>({

    company: [{ required: true, whitespace: true, message: '请输入公司名称', trigger: 'blur' }],
})

// 初始化数据
const initDefaultData = async () => {
    if (!props.data) return
    const propsData = props.data

    form.data.company = propsData.title
    form.data.company_en = propsData.title_en
    form.data.address = propsData.address
    form.data.address_en = propsData.address_en
    form.data.logo = propsData.logo || ''
    form.data.logo2 = propsData.logo2 || ''
    form.data.qr_code = propsData.qrCode || ''
    form.data.phone = propsData.phone || ''
    form.data.email = propsData.email || ''
    form.data.seo_keyword = propsData.keyword || ''
    form.data.seo_description = propsData.description || ''
    form.data.filing = propsData.filing || ''
    form.data.copyright = propsData.copyright || ''
    form.data.filing_en = propsData.filing_en || ''
    form.data.copyright_en = propsData.copyright_en || ''

    form.data.icon = propsData.icon || ''
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 确定
const onSubmit = async () => {
    const param: ISystemEditParams = {
        title: form.data.company?.trim() ?? '',
        address: form.data.address?.trim() ?? '',
        title_en: form.data.company_en?.trim() ?? '',
        address_en: form.data.address_en?.trim() ?? '',
        phone: form.data.phone?.trim() ?? '',
        email: form.data.email?.trim() ?? '',
        logo: form.data.logo?.trim() ?? '',
        logo2: form.data.logo2?.trim() ?? '',
        qr_code: form.data.qr_code?.trim() ?? '',
        seo_keyword: form.data.seo_keyword?.trim() ?? '',
        seo_description: form.data.seo_description?.trim() ?? '',
        filing: form.data.filing?.trim() ?? '',
        copyright: form.data.copyright?.trim() ?? '',
        filing_en: form.data.filing_en?.trim() ?? '',
        copyright_en: form.data.copyright_en?.trim() ?? '',
        icon: form.data.icon?.trim() ?? '',
    }

    const res = await ApiFunc(setSystemInfo(param))
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
