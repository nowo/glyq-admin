<template>
    <div class="layout-view-bg-white layout-view-link flex" :style="{ height: `calc(100vh - ${setLinkHeight}` }">
        <a :href="currentRouteMeta.linkUrl" target="_blank" rel="opener" class="flex-margin">
            {{ currentRouteMeta.title }}：{{ currentRouteMeta.isLink }}
        </a>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, toRefs, watch } from 'vue'
import type { RouteMeta } from 'vue-router'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/stores/themeConfig'

const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const route = useRoute()
const state = reactive({
    currentRouteMeta: {} as RouteMeta,
})
// 设置 link 的高度
const setLinkHeight = computed(() => {
    const { isTagsView } = themeConfig.value
    if (isTagsView) return '115px'
    else return '80px'
})
// 监听路由的变化，设置内容
watch(
    () => route.path,
    () => {
        state.currentRouteMeta = route.meta
    },
    {
        immediate: true,
    },
)

const { currentRouteMeta } = toRefs(state)
</script>
