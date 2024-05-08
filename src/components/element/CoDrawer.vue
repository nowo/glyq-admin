<template>
    <el-drawer v-model="visible" v-bind="$attrs" @close="onClose">
        <template #header>
            <h3>{{ props.title }}</h3>
        </template>
        <template #default>
            <slot />
        </template>
        <template v-if="!props.noFooter" #footer>
            <el-button @click="onCancel">
                取 消
            </el-button>
            <el-button type="primary" :loading="props.loading" @click="onConfirm">
                确 定
            </el-button>
        </template>
    </el-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'

const props = defineProps({
    visible: { // 弹窗显示
        type: Boolean,
        default: false,
    },
    title: { // 弹窗标题
        type: String,
        default: '',
    },
    loading: { // 确定按钮loading
        type: Boolean,
        default: false,
    },
    noFooter: { // 是否显示底部按钮
        type: Boolean,
        default: false,
    },
    hidden: { // 是否显示最大化、最小化按钮
        type: Boolean,
        default: false,
    },
})
const emits = defineEmits([
    // 'update:modelValue',
    'update:visible',
    'cancel',
    'close',
    'confirm',
])

const defData = reactive({
    visible: props.visible,
    fullscreen: false,
})

// 子组件定义自己的visible
const visible = computed({
    get: () => props.visible,
    set: (value) => {
        emits('update:visible', value)
    },
})

const iconName = computed(() => {
    return defData.fullscreen ? 'ele-CopyDocument' : 'ele-FullScreen'
})

const onToggle = () => {
    defData.fullscreen = !defData.fullscreen
    // emits('update:fullscreen', defData.fullscreen)
}

// 关闭弹窗
const onClose = () => {
    emits('close')
    visible.value = false
}

// 点击取消
const onCancel = () => {
    emits('cancel')
    visible.value = false
}

// 点击确定
const onConfirm = () => {
    emits('confirm')
    // visible.value = false
}
</script>
