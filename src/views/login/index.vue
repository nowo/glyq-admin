<template>
    <div class="h100vh w100%">
        <Particle class="fixed left-0 top-0" />
        <div class="relative z-10 h90% flex items-center justify-center">
            <div class="w400px">
                <h3 class="color-info mb20px text-center text-24px">
                    <img src="@/assets/images/logo.jpeg" alt="">
                    <br>
                    后台管理系统
                </h3>
                <Account />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Account from '@/views/login/components/account.vue'
import Particle from '@/views/login/components/particle.vue'
</script>

<style lang="scss" scoped></style>
