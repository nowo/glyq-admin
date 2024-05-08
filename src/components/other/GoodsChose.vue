<template>
    <my-dialog v-model:visible="defData.visible" title="选择商品" width="1000px" @close="onClose" @cancel="onClose"
        @confirm="onConfirm">
        <MyFormTool ref="formToolRef" class="form-bx" :data="searchData" :rules="rules" inline @submit.prevent="onSearch">
            <template #class_id="{ row }">
                <my-cascader v-model="row.class_id" :options="defData.classList"
                    :props="{ checkStrictly: true, emitPath: false, value: 'cat_id', label: 'cat_name' }"
                    placeholder="" />
            </template>
            <template #brand_id="{ row }">
                <div class="flex items-center">
                    <el-select v-model="row.brand_id" class="w130px" filterable clearable>
                        <el-option v-for="item in defData.brandList" :key="item.brand_id" :label="item.brand_name"
                            :value="item.brand_id" />
                    </el-select>
                    <el-checkbox v-model="row.is_chose" class="ml5px w65px" label="Option 1" @change="showChoseData">
                        已选<span>{{ defData.multipleSelection.length || '' }}</span>
                    </el-checkbox>
                </div>
            </template>
        </MyFormTool>
        <MyTable ref="myTableRef" v-model:page="tableData.pagination" v-model:table-header="tableData.tableHeader"
            class="table-box dialog-flex" scrollbar-always-on :data="tableData.data" row-key="goods_id"
            @update:page="onHandleCurrentChange" @selection-change="onTableSelect" @row-click="rowClick">
            <template #goods_img="{ scopes }">
                <el-image style="width: 34px;height:34px;display:block;" :src="scopes.row.goods_img" fit="cover">
                    <template #error>
                        <div class="image-err">
                            <el-icon>
                                <ele-Picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
            </template>
        </MyTable>
    </my-dialog>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'

import { GoodsListApi } from '@/api/goods/list'
import { useGoodsBrandState, useGoodsClassState } from '@/stores/main/goods'

import MyTable from '@/components/element/MyTable.vue'
import MyFormTool from '@/components/element/MyFormTool.vue'
import { PAGINATION } from '@/config/global'

const emits = defineEmits<{
    (event: 'chose', param: GoodsListApi_GetListItem[]): void
}>()
const useGoodsBrand = useGoodsBrandState()
const useGoodsClass = useGoodsClassState()

const myTableRef = ref<InstanceType<typeof MyTable> | null>(null)
const formToolRef = ref<InstanceType<typeof MyFormTool> | null>(null)

const defData = reactive({
    visible: false,
    ready: false,
    brandList: [] as GoodsBrandApi_GetListItem[], // 品牌列表
    classList: [] as GoodsClassApi_GetListItem[], // 商品分类

    multipleSelection: [] as GoodsListApi_GetListItem[],
})

// form表单数据类型
interface FormSearchData {
    goods_name: '' // 商品名称
    class_id: '' // 商品分类
    brand_id: '' // 商品品牌
    is_chose: boolean // 是否显示已选择内容
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        goods_name: '', // 商品名称
        class_id: '', // 商品分类
        brand_id: '', // 商品品牌
        is_chose: false, // 是否显示已选择内容, 默认为false, 不显示选中项
    },
    config: [
        { itemProp: { label: '商品名称', prop: 'goods_name' }, placeholder: '请输入商品名称', width: '180' },
        { itemProp: { label: '商品分类', prop: 'class_id' }, slot: true, placeholder: '', width: '130' },
        { itemProp: { label: '商品品牌', prop: 'brand_id' }, slot: true, placeholder: '', width: '200' },
        // { itemProp: { label: "已选择项", prop: "brand_id", }, slot: true, placeholder: '', width: '130' },
    ],
    hideBtn: true,
    // showAll: true,
    searchFunc: () => initTableData(),
})
const rules = reactive<FormRules>({

})

type TableDataItem = GoodsListApi_GetListItem
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: '', label: '', type: 'selection', width: 38, reserveSelection: true },
        { property: 'goods_img', label: '图片', width: 60, align: 'center', slot: true },
        { property: 'goods_sn', label: '商品编号', width: 90 },
        { property: 'goods_name', label: '商品名称', minWidth: 180 },
        { property: 'goods_code', label: '商品型号', width: 140 },
        { property: 'goods_spec', label: '商品规格', width: 140 },
        { property: 'unit', label: '商品单位', width: 85, align: 'center' },
        { property: 'market_price', label: '市场价', width: 85, align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化数据
const initDefaultData = async () => {
    if (defData.ready) return

    // 获取品牌和分类
    const [res1, res2] = await Promise.all([
        useGoodsBrand.getBrandList(),
        useGoodsClass.getClassList(),
    ])

    defData.brandList = res1
    defData.classList = res2

    defData.ready = true
}

// 表格数据
const initTableData = async () => {
    const data: GoodsListApi_GetList = {
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
        is_paging: 1,
        is_sale: 1,
        keyword: searchData.data.goods_name,
        cat_id: Number(searchData.data.class_id),
        brand_id: Number(searchData.data.brand_id),
        // goods_id: '1,20'
    }

    if (!data.keyword) delete data.keyword
    if (!data.cat_id) delete data.cat_id
    if (!data.brand_id) delete data.brand_id

    if (searchData.data.is_chose) {
        data.goods_id = defData.multipleSelection.map(item => item.goods_id).join(',')
    }

    const res = await GoodsListApi.getList(data)
    if (res.code != 200) return ElMessage.error(res.msg)
    if (!defData.visible && !res.data.goods.lists.length) return ElMessage.error('暂无商品')

    tableData.data = res.data.goods.lists

    tableData.pagination.total = res.data.goods.total

    defData.visible = true
}

// 显示已选商品
const showChoseData = () => {
    tableData.pagination.page = 1
    initTableData()
}

// 多选
const onTableSelect = (val: GoodsListApi_GetListItem[]) => {
    defData.multipleSelection = val
}

// 表格点击
const rowClick = (row: GoodsListApi_GetListItem) => {
    const index = defData.multipleSelection.indexOf(row)
    const select = !(index >= 0)

    myTableRef.value?.tableRef?.toggleRowSelection(row, select)
}

// 打开弹窗
const openDialog = async (row: GoodsListApi_GetListItem[]) => {
    await initDefaultData()
    await initTableData()
    // defData.multipleSelection = []

    const goods_id = row.map(row => row.goods_id).join(',') // 获取选中的品牌id列表  // 将id列表转换成
    if (!goods_id) {
        nextTick(() => {
            myTableRef.value?.tableRef?.clearSelection()
        })
    } else {
        const res = await GoodsListApi.getList({ goods_id })
        if (res.code != 200) return ElMessage.error(res.msg) // 检查是否成功

        // defData.multipleSelection = row
        res.data.goods.lists.forEach((item) => {
            nextTick(() => {
                myTableRef.value?.tableRef?.toggleRowSelection(item, true)
            })
        })
    }
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false

    formToolRef.value?.formRef?.resetFields() // 清空表单
    myTableRef.value?.tableRef?.clearSelection() // 清空选中项
}

// 确定
const onConfirm = useThrottleFn(() => {
    if (!defData.multipleSelection.length) return ElMessage.error('请先选择商品')

    const data = defData.multipleSelection
    // .map(item => {
    //     let obj: BoundInoutTableItem = {
    //         a_id: 0,
    //         a_number: 0,
    //         a_price: 0,
    //         a_count: 0,
    //         stock_list: [],
    //         a_warehouse_id: '',
    //         a_warehouse_name: '',
    //         goods_id: item.goods_id,
    //         goods_name: item.goods_name,
    //         goods_code: item.goods_code,
    //         goods_spec: item.goods_spec,
    //         unit: item.unit,
    //         brand_name: item.brand_name
    //     }
    //     return obj
    // })

    emits('chose', data)
    onClose() // 关闭弹窗
}, 800)

const onSearch = () => {
    tableData.pagination.page = 1 // 重置页码
    initTableData()
}

// 分页改变
const onHandleCurrentChange = () => {
    initTableData()
}

// 页面加载时
onMounted(() => {
    // initDefaultData();
})

defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped>
.form-bx {
    :deep(.el-form-item) {
        padding-right: 15px;
    }
}
</style>
