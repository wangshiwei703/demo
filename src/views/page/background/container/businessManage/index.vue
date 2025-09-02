<template>
    <div class="businessManage">
        <div>

        <navAside :title="title" :navList="navList"></navAside>
        </div>
        <div class="businessManage-main">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup>
import navAside from '../../aside/index.vue'
const title = '业务管理'
const navList = [
    {
        name: '项目管理',
        icon: 'Setting',
        children: [
            { name: '项目列表', router: '/businessManage/PMList', icon: 'Setting' },
            { name: '项目组列表', router: '/businessManage/PMGroupList', icon: 'Setting' }
        ]
    },
]


</script>


<style lang="less" scoped>
.businessManage{
    height: 100%;
    width: 100%;
    display: flex;
    .businessManage-main{
        width: 0;
        flex: 1;
        transition: width 0.3s ease; /* 跟随左侧变化的过渡动画 */
    }
}
</style>