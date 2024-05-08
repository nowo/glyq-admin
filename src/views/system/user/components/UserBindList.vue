<template>
    <my-dialog v-model:visible="defData.visible" auto-height hidden :title="comData.title"
        width="680px" @close="onClose" @cancel="onClose" @confirm="onConfirm">
        <my-table v-model:page="tableData.pagination" :table-header="tableData.tableHeader" :data="tableData.data"
            class="jm-box" @update:page="onHandleCurrentChange" />
    </my-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'
import { UserApi } from '@/api/system/user'
import { PAGINATION } from '@/config/global'

const formRef = ref<FormInstance>()

const defData = reactive({
    visible: false,
    ready: false,
    id: 0, // 管理员id
})

const comData = computed(() => {
    return { title: '关联用户列表' }
})

type TableDataItem = UserApi_GetBindListResponse['lists'][0]
const tableData = reactive<TableType<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'user_id', label: 'id', width: 80 },
        { property: 'user_name', label: '用户名称', minWidth: 200 },
        { property: 'phone', label: '手机号码', width: 130 },
        // { property: "operate", label: "操作", width: 100, align: "center", slot: true, fixed: "right" }
    ],
    pagination: {
        ...PAGINATION,
    },
})

const initTableData = async () => {
    const param: UserApi_GetBindList = {
        is_paging: 1,
        page: tableData.pagination.page,
        page_size: tableData.pagination.page_size,
        id: defData.id,
    }

    const res = await UserApi.getBindList(param)
    if (res.code !== 200) return ElMessage.error(res.msg)
    if (!defData.visible && res.data.lists.length === 0) return ElMessage.error('没有关联用户！')

    tableData.data = res.data.lists
    tableData.pagination.total = res.data.total || 0

    defData.visible = true
}

// 打开弹窗
const openDialog = async (row: UserApi_GetListResponse['list'][0]) => {
    tableData.pagination.page = 1
    defData.id = row.id

    await initTableData()
}

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
    onClose() // 关闭弹窗
}, 800)

// 分页改变
const onHandleCurrentChange = () => {
    initTableData()
}

defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped></style>
