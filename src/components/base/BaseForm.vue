<template>
    <div>
        <el-tabs v-model="defData.lang" class="demo-tabs" @tab-click="onTabClick">
            <el-tab-pane label="中文" name="cn" />
            <el-tab-pane label="英文" name="en" />
        </el-tabs>
        <slot />
    </div>
</template>

<script lang="ts" setup>
const defData = reactive({
    lang: 'cn',
})

const onTabClick = (key: any) => {

}
</script>

<style lang="scss" scoped></style>
