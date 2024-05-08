<template>
    <my-box v-loading="defData.loading">
        <my-form-tool :data="searchData" inline @submit.prevent="onSearch">
            <el-button type="success" @click="onOpenAddMenu('')">
                <el-icon>
                    <ele-FolderAdd />
                </el-icon>
                新增菜单
            </el-button>
        </my-form-tool>
        <MyTable ref="myTableRef" v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader"
            class="jm-box table-box" :data="tableData.data" :row-class-name="setRowClassName" row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :default-expand-all="defData.expand"
            @update:page="onHandleCurrentChange" @row-click="rowClick">
            <template #operate="{ scopes }">
                <el-button size="small" text type="primary" @click.stop="onOpenAddMenu(scopes.row)">
                    新增
                </el-button>
                <el-button size="small" text type="primary" @click.stop="onOpenEditMenu(scopes.row)">
                    修改
                </el-button>
                <el-button size="small" text type="primary" @click.stop="onRowDel(scopes.row)">
                    删除
                </el-button>
            </template>
        </MyTable>
        <MenuModel ref="modelRef" :data="defData.menuData" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import MenuModel from '@/views/system/menu/components/MenuModel.vue'
import { PAGINATION } from '@/config/global'

import { MenuApi } from '@/api/system/menu'
import { filterTreeList } from '@/utils/common/tree'

const modelRef = ref<InstanceType<typeof MenuModel> | null>(null)
const myTableRef = ref()

const defData = reactive({
    loading: false,
    menuData: [] as MenuApi_MenuItem[],

    expand: false, // 是否默认展开
})

// form表单数据类型
interface FormSearchData {
    name: string
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        name: '',
    },
    config: [
        { itemProp: { label: '菜单名称', prop: 'name' }, placeholder: '请输入菜单名称', width: '200' },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = MenuApi_MenuItem
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 100 },
        { property: 'title', label: '菜单名称', minWidth: 150 },
        { property: 'title_en', label: '英文菜单名称', minWidth: 150 },
        { property: 'href', label: '链接地址', minWidth: 150 },
        // { property: 'redirect', label: '重定向', width: 200 },
        // { property: 'page_path', label: '组件路径', width: 200 },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 130, fixed: 'right', align: 'center', slot: true },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化菜单数据
const initTableData = async () => {
    const res = await MenuApi.getList()
    if (res.code !== 200) return ElMessage.error(res.msg)

    defData.menuData = res.data.list
    if (searchData.data.name) {
        // 属性数据模糊查询
        tableData.data = filterTreeList(defData.menuData, searchData.data.name, 'title')
    } else {
        tableData.data = res.data.list
    }

    tableData.pagination.total = defData.menuData.length
}

// 添加class
const setRowClassName = ({ row }: { row: MenuApi_MenuItem }) => {
    return ''
    // return row.is_hide ? 'row-info-bg' : ''
}

// 当前行点击
const rowClick = (row: MenuApi_MenuItem) => {
    myTableRef.value?.tableRef?.toggleRowExpansion(row)
}

// 打开新增菜单弹窗
const onOpenAddMenu = (row: MenuApi_MenuItem | '') => {
    const id = row ? row.id : undefined
    modelRef.value?.openDialog(id)
    // addMenuRef.value?.openDialog(row)
}
// 打开编辑菜单弹窗
const onOpenEditMenu = (row: MenuApi_MenuItem) => {
    modelRef.value?.openDialog(row)
    // editMenuRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: MenuApi_MenuItem) => {
    if (row.children?.length) return ElMessage.error('当前项下有子类,请先删除该项下的子类目')

    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await MenuApi.del({ id: row.id })
        if (res.code !== 200) return ElMessage.error(res.msg)

        ElMessage.success('删除成功')
        initTableData() // 更新列表数据
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

// 加载时
onBeforeMount(() => {
    initTableData()
})
</script>

<style lang="scss" scoped>
.table-box {
    :deep(.el-table__body-wrapper) {
        .row-info-bg {
            --el-table-tr-bg-color: var(--el-color-info-light-8);
            opacity: 0.8;
        }
    }
}
</style>
