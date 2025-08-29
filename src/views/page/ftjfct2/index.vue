<template>
    <div class="ab-container">
        <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
        <div v-if="showPageA" class="page-a" style="padding-bottom: 60px;">
            <img src="@image/ftjfcp-header.png" class="a-image" style="width: 100%;height: 100%;" />
            <div class="bottom" style="display: flex;justify-content: space-around;">
                <LineAddButton :lineList="lineList" />
            </div>
        </div>

        <div v-else class="seatable-container" style="padding-bottom: 60px;">
            <div class="seatable-container-header">
                <homeHeader></homeHeader>
            </div>

            <div class="bottom" style="display: flex;justify-content: space-around;">
                <LineAddButton :lineList="lineList" />
            </div>

            <div class="seatable-container-header">
                <homeHeader2></homeHeader2>
            </div>

            <div class="bottom" style="display: flex;justify-content: space-around;">
                <LineAddButton :lineList="lineList" />
            </div>

            <ScrollButtons></ScrollButtons>

            <van-floating-bubble v-model:offset="bubbleOffset" axis="y" icon="chat" magnetic="x" @click="handleAddLine">
                <template #default>
                    <img src="@image/linelogo.png" style="width: 35px;" />
                </template>
            </van-floating-bubble>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LineAddButton from '../../components/LineAddButtonFT3.vue';
import homeHeader from './components/header.vue'
import homeHeader2 from './components/header2.vue'
import ScrollButtons from '../../components/ScrollButtons.vue';
import { useWindowSize } from '@vant/use';

const lineList = [{
    id: '@890gbhyh',
    url: 'https://lin.ee/BDAt3fC',
}, {

    id: '@426qqpel',
    url: 'https://lin.ee/Ul7ph3y'
}]

// 随机选择一个企业微信账号
const selectRandomWecom = () => {
    const randomIndex = Math.floor(Math.random() * lineList.length);
    return lineList[randomIndex];
};


// 处理添加LINE操作
const handleAddLine = async () => {
    triggerTikTokConversion()
    const lineObj = selectRandomWecom()

    // 1. 打开LINE添加页面
    window.open(lineObj.url, '_blank');
    // window.location.href = 'https://line.me/ti/p/dZG9cwvMLs'
};


// 触发TikTok Pixel转化事件
const triggerTikTokConversion = () => {
    if (window.fbq) {
        window.fbq('track', 'Contact');
    }
};


// 页面状态
const showPageA = ref(true);

onMounted(() => {
    // 默认高度
    const { width, height } = useWindowSize();
    bubbleOffset.value.y = height.value - 260
    bubbleOffset.value.x = width.value - 72
});


const bubbleOffset = ref({ x: 0, y: 0 });
</script>

<style scoped>
/* 样式保持不变 */
.ab-container,
.seatable-container {
    width: 100%;
    background: #f7f8fa;
}

.a-image {
    width: 100%;
    display: block;
    /* 解决inline-block带来的换行间隙 */
    margin: 0;
    /* 清除默认外边距 */
    padding: 0;
    /* 清除默认内边距 */
    border: none;
    /* 某些浏览器会给图片加默认边框 */
}
</style>


<style>
.van-floating-bubble {
    background: #37c200 !important;
}
</style>