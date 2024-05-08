<template>
    <el-dialog v-model="defData.visible" draggable title="新增菜单" width="860px">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="mb20px">
                    <el-form-item label="上级菜单" prop="menuPidArr">
                        <my-cascader v-model="formData.menuPidArr" class="w100%" :options="defData.routeArr"
                            :props="{ checkStrictly: true, value: 'id', label: 'title', disabled: 'a_disable' }"
                            placeholder="请选择上级菜单" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20px">
                    <el-form-item label="菜单类型" prop="menuType">
                        <el-radio-group v-model="formData.menuType">
                            <el-radio :label="1">
                                菜单
                            </el-radio>
                            <el-radio :label="2">
                                按钮
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <template v-if="formData.menuType === 1">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="菜单名称" prop="title">
                            <el-input v-model="formData.title" maxlength="20" placeholder="请输入菜单名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <!-- <el-form-item label="路由名称" prop="name">
                                <el-input v-model="formData.name" maxlength="20" placeholder="路由中的 name 值" clearable>
                                </el-input>
                            </el-form-item> -->
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="视图路径" prop="component">
                            <el-select v-model="formData.component" class="w100%" placeholder="视图路径" filterable clearable
                                :filter-method="filterComponent">
                                <el-option v-for="item in defData.componentList" :key="item.value" class="comp-box"
                                    :label="item.value" :value="item.value" @click="choseComponent">
                                    <span class="mr5px">{{ item.value }}</span>
                                    <em>{{ item.title }}</em>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="api接口地址" prop="api_path">
                            <el-input v-model="formData.api_path" maxlength="60" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="路由路径" prop="path">
                            <el-input v-model="formData.path" maxlength="60" placeholder="路由路径，例如/abc" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="重定向" prop="redirect">
                            <el-input v-model="formData.redirect" maxlength="60" placeholder="请输入路由重定向" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="菜单图标" prop="icon">
                            <IconSelector v-model="formData.icon" placeholder="请输入菜单图标" type="all" />
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="链接地址" prop="linkUrl">
                            <el-input v-model="formData.linkUrl" placeholder="外链/内嵌时链接地址（http:xxx.com）" clearable
                                :disabled="!formData.isLink" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                            <el-form-item label="权限标识" prop="roles">
                                <el-select v-model="formData.roles" multiple placeholder="取角色管理" clearable class="w100%">
                                    <el-option label="admin" value="admin"></el-option>
                                    <el-option label="common" value="common"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                </template>
                <template v-if="formData.menuType === 2">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="按钮名称" prop="title">
                            <el-input v-model="formData.title" maxlength="20" placeholder="请输入按钮名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="api接口地址" prop="api_path">
                            <el-input v-model="formData.api_path" maxlength="60" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12"></el-col> -->
                    <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                            <el-form-item label="权限标识">
                                <el-input v-model="formData.btnPower" placeholder="请输入权限标识" clearable></el-input>
                            </el-form-item>
                        </el-col> -->
                </template>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                    <el-form-item label="排序">
                        <el-input-number v-model="formData.sort" :min="0" :max="10000" controls-position="right"
                            placeholder="请输入排序" class="w100%" />
                    </el-form-item>
                </el-col>
                <template v-if="formData.menuType === 1">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="是否隐藏">
                            <el-radio-group v-model="formData.isHide">
                                <el-radio :label="1">
                                    隐藏
                                </el-radio>
                                <el-radio :label="0">
                                    不隐藏
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="页面缓存">
                            <el-radio-group v-model="formData.isKeepAlive">
                                <el-radio :label="1">
                                    缓存
                                </el-radio>
                                <el-radio :label="0">
                                    不缓存
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="是否固定">
                            <el-radio-group v-model="formData.isAffix">
                                <el-radio :label="1">
                                    固定
                                </el-radio>
                                <el-radio :label="0">
                                    不固定
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="是否外链">
                            <el-radio-group v-model="formData.isLink">
                                <el-radio :label="1">
                                    是
                                </el-radio>
                                <el-radio :label="0">
                                    否
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20px">
                        <el-form-item label="是否内嵌">
                            <el-radio-group v-model="formData.isIframe" @change="onSelectIframeChange">
                                <el-radio :label="1">
                                    是
                                </el-radio>
                                <el-radio :label="0">
                                    否
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="onSubmit">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { inject, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import IconSelector from '@/components/icon/IconSelect.vue'
import { MainPage } from '@/router/layout'
import { deepClone } from '@/utils/other'
import { getParentId } from '@/utils/common/tree'
import { formErrorMessage } from '@/utils/element/form'
import { MenuApi } from '@/api/system/menu'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'

const props = defineProps({
    data: {
        type: Array as PropType<MenuApi_MenuItem[]>,
        default: () => [],
    },
})
const reloadTable = inject<() => void>('reloadTable')
const defData = reactive({
    visible: false, // 弹窗显示
    menuData: [], // 上级菜单数据
    ready: false,
    routeArr: [] as MenuApi_MenuItem[],
    componentList: MainPage,
})
const formRef = ref<FormInstance>()
// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
const formData = reactive({
    menuPidArr: [] as string[],
    menuType: 1, // 菜单类型
    name: '', // 路由名称
    component: '', // 组件路径
    sort: 0, // 菜单排序
    path: '', // 路由路径
    redirect: '', // 路由重定向，有子集 children 时
    title: '', // 菜单名称
    icon: '', // 菜单图标
    isHide: 0 as 0 | 1, // 是否隐藏
    isKeepAlive: 0 as 0 | 1, // 是否缓存
    isAffix: 0 as 0 | 1, // 是否固定
    isLink: 0 as 0 | 1, // 是否外链
    linkUrl: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
    isIframe: 0 as 0 | 1, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
    roles: '', // 权限标识，取角色管理
    btnPower: '', // 菜单类型为按钮时，权限标识
    api_path: '', // api接口地址
})

// 验证为空时
const validateEmpty = (rule: any, value: any, callback: any) => {
    if (value.trim() === '') {
        return callback(new Error('必填项不能为空'))
    }
    return callback() // *验证成功的地方必须callback()
}
const validatePath = (rule: any, value: any, callback: any) => {
    const defaultRoute = ['/404', '/401', '/login']
    if (defaultRoute.includes(value)) {
        // ElMessage.error(value + '为默认使用的路由,请换一个')
        return callback(new Error(`${value}为默认使用的路由,请换一个`))
    }
    return callback() // *验证成功的地方必须callback()
}
const rules = reactive<FormRules>({
    title: [ // 菜单名称
        { required: true, message: '必填项不能为空', trigger: 'blur' },
        { validator: validateEmpty, trigger: 'blur' },
    ],
    name: [
        { required: true, pattern: /^[0-9a-zA-Z]+$/, message: '只能输入数字和英文', trigger: 'blur' },
    ],
    path: [
        { pattern: /^(\/([A-Za-z0-9_-]+))+$/, message: '以/开头,后面为字母或数字,不能有空格', trigger: 'blur' },
        { validator: validatePath, trigger: 'blur' },
        // { required: true, pattern: /^\/[A-Za-z0-9_-]+$/, message: '以/开头，后面为字母或数字，/只能出现一次', trigger: 'blur' },
        // {
        //     validator: (rule: any, value: any, callback: any) => {
        //
        //         let len = value.match(/\//igm).length

        //         if (len > 1) {
        //             callback(new Error('/只能出现一次'))
        //         } else {
        //             if (formData.paths !== '') {
        //                 formRef.value?.validateField('paths', () => null)
        //             }
        //             callback()
        //         }
        //     }, trigger: 'blur'
        // },
    ],
    component: [ // 视图路径
        { required: true, message: '必填项不能为空', trigger: 'blur' },
        { validator: validateEmpty, trigger: 'blur' },
    ],
    redirect: [
        { pattern: /^(\/([A-Za-z0-9_-]+))+$/, message: '以/开头,后面为字母或数字,不能有空格', trigger: 'blur' },
    ],

})

const initDefaultData = async () => {
    if (defData.ready) return

    defData.ready = true
}

// 组件选中时
const choseComponent = () => {
    if (formData.component === 'layout/routerView/parent') return
    const node = MainPage.find(item => item.value === formData.component)

    if (!formData.title) formData.title = node?.title || ''
    if (!formData.path) formData.path = node?.name ? `/${node?.name}` : ''
}

// 组件过滤
const filterComponent = (str: string) => {
    const query = str?.trim() ?? ''
    if (query) {
        defData.componentList = MainPage.filter((item) => {
            if (item.value.toLowerCase().includes(query)) {
                return true
            } else if (item.title.toLowerCase().includes(query)) {
                return true
            } else {
                return false
            }
        })
    } else {
        defData.componentList = MainPage
    }
}

// 打开弹窗
const openDialog = async (row?: MenuApi_MenuItem) => {
    formData.menuPidArr = row?.id ? getParentId(props.data, row.id, 'id') as unknown as string[] : []

    const arr = deepClone(props.data)
    defData.routeArr = arr

    await initDefaultData()
    defData.visible = true
}
// 关闭弹窗
const closeDialog = () => {
    formRef.value?.resetFields()
    defData.visible = false
}
// 是否内嵌下拉改变
const onSelectIframeChange = () => {
    if (formData.isIframe) formData.isLink = 1
    else formData.isLink = 0
}
// 取消
const onCancel = () => {
    closeDialog()
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 新增
const onSubmit = async () => {
    const isRun = await formRef.value?.validate((valid, fields) => valid ? true : formErrorMessage(fields))
    if (!isRun) return

    const data: MenuApi_Add = {
        menuType: formData.menuType, // 菜单类型'menu' or 'btn'
        menuPid: formData.menuPidArr.join(','),
        component: formData.component,
        sort: formData.sort,
        path: formData.path,
        redirect: formData.redirect,
        title: formData.title,
        icon: formData.icon,
        isHide: formData.isHide,
        isKeepAlive: formData.isKeepAlive,
        isAffix: formData.isAffix,
        isLink: formData.isLink,
        linkUrl: formData.linkUrl,
        isIframe: formData.isIframe,
        api_path: formData.api_path?.trim() ?? '',
    }
    const res = await ApiFunc(MenuApi.add(data))
    if (res.code !== 200) return ElMessage.error(res.msg)

    ElMessage.success('添加成功')

    closeDialog()
    reloadTable?.() // 刷新列表
}

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
