<template>
    <my-box v-loading="defData.loading">
        <my-form-tool :data="searchData" inline @submit.prevent="onSearch">
            <template #type="{ row }">
                <el-select v-model="row.type" clearable filterable>
                    <el-option v-for="item in defData.menuData" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
            </template>
            <el-button type="success" @click="onOpenAdd()">
                <i class="i-ep-plus mr5px" />
                新增{{ props.title }}
            </el-button>
        </my-form-tool>
        <MyTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" class="jm-box table-box"
            :data="tableData.data" @update:page="onHandleCurrentChange">
            <template #img="{ scopes }">
                <co-image :src="scopes.row.img" :icon-size="28" :preview-src-list="[scopes.row.img]" preview-teleported
                    fit="contain" class="ma h50px w60px block!" />
            </template>
            <template #type="{ scopes }">
                {{ getGoodsTypeName(scopes.row) }}
            </template>
            <template #isHide="{ scopes }">
                <el-tag v-if="scopes.row.isHide" type="info">
                    否
                </el-tag>
                <el-tag v-else type="">
                    是
                </el-tag>
            </template>
            <template #operate="{ scopes }">
                <el-button size="small" text type="primary" @click.stop="onOpenEdit(scopes.row)">
                    修改
                </el-button>
                <el-button size="small" text type="primary" @click.stop="onRowDel(scopes.row)">
                    删除
                </el-button>
            </template>
        </MyTable>
        <NewsModel ref="modelRef" v-bind="props" :list="defData.menuData" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import NewsModel from './NewsModel.vue'
import { PAGINATION } from '@/config/global'
import { getGoodsList, setGoodsDelete } from '@/api/list'
import { MenuApi } from '@/api/system/menu'

const props = defineProps<{
    // type: number
    title: string
}>()
const modelRef = ref<InstanceType<typeof NewsModel>>()

const defData = reactive({
    loading: false,
    menuData: [] as MenuApi_MenuItem[],
    expand: false, // 是否默认展开
})

// form表单数据类型
interface FormSearchData {
    name: string
    type: string | number
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        name: '',
        type: '',
    },
    config: [
        { itemProp: { label: `${props.title}名称`, prop: 'name' }, placeholder: `请输入${props.title}名称`, width: '200' },
        { itemProp: { label: `${props.title}分类`, prop: 'type' }, placeholder: '', width: '160', slot: true },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = IGoodsGetListResponse['list'][0]
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 70 },
        { property: 'img', label: '图片', width: 100, align: 'center', slot: true },

        { property: 'title', label: '标题名称', minWidth: 150 },
        { property: 'type', label: '分类名称', width: 180, slot: true },
        { property: 'isHide', label: '首页推荐', width: 150, align: 'center', slot: true },
        // { property: 'redirect', label: '重定向', width: 200 },
        // { property: 'page_path', label: '组件路径', width: 200 },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 130, fixed: 'right', align: 'center', slot: true },
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initDefaultData = async () => {
    const res = await MenuApi.getList()
    if (res.code !== 200) return ElMessage.error(res.msg)

    const list = res.data.list.filter(item => item.id === 3)

    defData.menuData = list[0]?.children || []
}

// 初始化菜单数据
const initTableData = async () => {
    const data: IGoodsGetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        title: searchData.data.name?.trim() ?? '',
        // type: Number(searchData.data.type) || '',
    }
    if (searchData.data.type) data.type = Number(searchData.data.type)

    const res = await getGoodsList(data)
    if (res.code !== 200) return ElMessage.error(res.msg)

    console.log(res)

    tableData.data = res.data.list
    tableData.pagination.total = res.data.total
}

// 获取商品分类名称
const getGoodsTypeName = (row: IGoodsGetListResponse['list'][0]) => {
    const node = defData.menuData.find(item => item.id === row.type)
    return node?.title
}

// 打开新增菜单弹窗
const onOpenAdd = () => {
    modelRef.value?.openDialog()
}
// 打开编辑菜单弹窗
const onOpenEdit = (row: IGoodsGetListResponse['list'][0]) => {
    modelRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: IGoodsGetListResponse['list'][0]) => {
    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await setGoodsDelete({ id: row.id })
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
    initDefaultData()
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
