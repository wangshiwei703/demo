<template>
    <div class="common-layout">
        <el-container>
            <el-header class="common-layout-navHeader">
                <navHeader :navList="navList"></navHeader>
            </el-header>
        </el-container>
        <div class="common-layout-main">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup>
import navHeader from "./header/index.vue";
import { RouterView } from 'vue-router'
const navList = [
    { name: '首页', router: '/overview', icon: 'Setting' },
    {
        name: '产品',
        icon: 'Setting',
        children: [
            { name: '产品列表', router: '/products', icon: 'Setting' },
            { name: '新增产品', router: '/products/new', icon: 'Setting' }
        ]
    },
    { name: '业务管理', router: '/businessManage/PMList', icon: 'Setting' },
    { name: '数据管理', router: '/dataManagement', icon: 'Setting' }
]

</script>


<style lang="less" scoped>
.common-layout {
    width: 100%;
    height: 100vh;
    
    .common-layout-navHeader {
        background: #545c64;
    }

    .common-layout-main {
        height: calc(100% - 60px);
    }
}
</style>