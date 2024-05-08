<template>
    <el-image class="co-image" v-bind="$attrs">
        <template #error>
            <div class="co-image-error">
                <i class="i-ep-picture" />
                <!-- <i class="i-ep-picture-filled" /> -->
            </div>
        </template>
    </el-image>
</template>

<script lang="ts" setup>
const props = defineProps({
    iconSize: {
        type: Number,
    },
})
// 设置图标大小
const iconWid = computed(() => {
    return props.iconSize ? `${props.iconSize}px` : '36px'
})
</script>

<style lang="scss">
.co-image {

    &-error {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);

        i {
            // font-size: 36px;
            // font-size: var(--co-image-error-size, 36px);
            // font-size: var( --co-image-error-size,v-bind(iconWid));
            font-size: v-bind(iconWid);
        }
    }
}
</style>
