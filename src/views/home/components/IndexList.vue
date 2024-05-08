<template>
    <my-box v-loading="defData.loading">
        <div class="mb20px">
            <span class="mr20px text-16px font-bold">{{ props.title }}</span>
            <el-button type="success" @click="onOpenAdd">
                <i class="i-ep-plus mr5px" />
                新增
            </el-button>
            <el-button @click="onSearch">
                <i class="i-ep-refresh mr5px" />
                刷新
            </el-button>
        </div>
        <MyTable v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader" class="jm-box table-box"
            :data="tableData.data" @update:page="onHandleCurrentChange">
            <template #img="{ scopes }">
                <co-image :src="scopes.row.img" :icon-size="28" :preview-src-list="[scopes.row.img]" preview-teleported
                    fit="contain" class="ma h50px w100px block!" />
            </template>

            <template #isHide="{ scopes }">
                <el-tag v-if="scopes.row.isHide" type="info">
                    隐藏
                </el-tag>
                <el-tag v-else type="">
                    显示
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
        <MenuModel ref="modelRef" v-bind="props" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import MenuModel from '@/views/home/components/BannerModel.vue'
import { PAGINATION } from '@/config/global'

import { getBannerList, setBannerDelete } from '@/api/list'

const props = defineProps<{
    type: 1 | 2
    title: string
}>()

const modelRef = ref<InstanceType<typeof MenuModel>>()

const defData = reactive({
    loading: false,

})

type TableDataItem = IBannerGetListResponse['list'][0]
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 80 },
        { property: 'img', label: '图片', width: 120, slot: true, align: 'center' },
        { property: 'title', label: '标题', minWidth: 130 },
        { property: 'title_en', label: '英文标题', minWidth: 150 },
        { property: 'href', label: '链接地址', minWidth: 150 },
        { property: 'isHide', label: '是否隐藏', width: 100, align: 'center', slot: true },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 110, fixed: 'right', align: 'center', slot: true },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化菜单数据
const initTableData = async () => {
    const res = await getBannerList({ type: props.type })

    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list
    // tableData.pagination.total = res.total
}

// 打开新增菜单弹窗
const onOpenAdd = () => {
    modelRef.value?.openDialog()
}
// 打开编辑菜单弹窗
const onOpenEdit = (row: IBannerGetListResponse['list'][0]) => {
    modelRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: IBannerGetListResponse['list'][0]) => {
    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await setBannerDelete({ id: row.id })
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

<style lang="scss" scoped></style>
