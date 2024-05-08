<template>
    <my-box>
        <MyFormTool :data="searchData" inline @submit.prevent="onSearch">
            <template #role_id="{ row }">
                <el-select v-model="row.role_id" filterable clearable>
                    <el-option v-for="item in defData.roleList" :key="item.id" :label="item.role_name" :value="item.id" />
                </el-select>
            </template>
            <el-button type="success" @click="onAdd">
                <el-icon>
                    <ele-FolderAdd />
                </el-icon>
                新增用户
            </el-button>
        </MyFormTool>
        <my-table v-model:page="tableData.pagination" :table-header="tableData.tableHeader" :data="tableData.data"
            class="jm-box" @update:page="onHandleCurrentChange">
            <template #status="{ scopes }">
                <el-tag v-if="scopes.row.status === 1" type="success">
                    启用
                </el-tag>
                <el-tag v-else type="info">
                    禁用
                </el-tag>
            </template>

            <template #operate="{ scopes }">
                <el-button size="small" text type="primary" @click="onEdit(scopes.row)">
                    修改
                </el-button>
                <el-button size="small" text type="primary" :disabled="scopes.row.id === 1" @click="onDel(scopes.row)">
                    删除
                </el-button>
            </template>
        </my-table>
        <UserModel ref="modelRef" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import { UserApi } from '@/api/system/user'
import { PAGINATION } from '@/config/global'
import UserModel from '@/views/system/user/components/UserDrawer.vue'

type TableDataType = UserApi_GetListResponse['list'][0]

const modelRef = ref<InstanceType<typeof UserModel>>()

const defData = reactive({
    roleList: [] as RoleApi_GetListResponse['list'],
})

// form表单数据类型
interface FormSearchData {
    keyword: ''
    role_id: '' | number
    phone: ''
    account: ''
}

const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        keyword: '',
        role_id: '',
        phone: '',
        account: '',
    },
    config: [
        { itemProp: { label: '用户名称', prop: 'keyword' }, placeholder: '请输入用户名称', width: '180' },
        { itemProp: { label: '登录账号', prop: 'account' }, placeholder: '请输入登录账号', width: '180' },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})
// const rules = reactive<FormRules>({
//     amount: [{
//         validator: (rule, value, back) => {
//             if (value) {
//                 let num = Number(value);
//                 searchData.data.amount = Number.isNaN(num) ? '' : NumberFormat(num)
//             }
//             return back()
//         },
//         trigger: 'blur'
//     }]
// })

type TableDataItem = UserApi_GetListResponse['list'][0]
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 90 },
        { property: 'username', label: '用户名称', minWidth: 180 },
        { property: 'account', label: '登录账号', minWidth: 120 },
        { property: 'status', label: '状态', width: 120, align: 'center', slot: true },
        { property: 'operate', label: '操作', width: 100, align: 'center', slot: true, fixed: 'right' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initDefaultData = async () => {

}

const initTableData = async () => {
    const data: UserApi_GetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        username: searchData.data.keyword.trim() ?? '',
        account: searchData.data.account.trim() ?? '',
    }
    const res = await UserApi.getList(data)
    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list
    tableData.pagination.total = res.data.total || 0
}

// 新增
const onAdd = () => {
    modelRef.value?.openDialog()
}

// 修改
const onEdit = (row: TableDataType) => {
    modelRef.value?.openDialog(row)
}

// 删除
const onDel = (row: TableDataType) => {
    if (row.id === 1) return ElMessage.error('超级管理员不能删除')
    ElMessageBox.confirm('此操作将永久删除该条内容，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await UserApi.del({ id: row.id })
        if (res.code !== 200) return ElMessage.error(res.msg)

        ElMessage.success('删除成功')
        initTableData() // 重新加载列表数据
    }).catch(() => { })
}

// 查询
const onSearch = () => {
    initTableData()
}

// 分页改变
const onHandleCurrentChange = () => {
    initTableData()
}

onBeforeMount(() => {
    initDefaultData()
    initTableData()
})
</script>

<style lang="scss" scoped></style>
