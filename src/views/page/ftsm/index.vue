<!-- fb投放减肥 -->
<template>
    <div class="ab-container">
        <div v-if="showPageA" class="page-a" style="padding-bottom: 163px;">
            <img src="@image/smA.png" class="a-image" style="width: 100%;height: 100%;" />
        </div>

        <div v-else class="seatable-container" style="padding-bottom: 163px;">
            <div class="seatable-container-header">
                <homeHeader></homeHeader>
            </div>
        </div>


        <div class="bottom" style="display: flex;justify-content: space-around;">
            <LineAddButton :lineList="lineList" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LineAddButton from '../../components/LineAddButtonFT6.vue';
import homeHeader from './components/header.vue'
import axios from 'axios';
document.title = '科學助眠服務中心'
const lineList = [{
    id: '@426qqpel',
    url: 'https://lin.ee/ad7fSuH',
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
        window.fbq('track', 'CompleteRegistration');
    }
};

// 页面状态
const showPageA = ref(true);


// onMounted(async () => {
//   try {
//     // 调用第三方 IP 信息接口（无需 API 密钥）
//     const response = await axios('https://ipapi.co/json/');
//     let data = response.data
//     console.log(response.data);

//     if(data.country_name == 'Taiwan'){
//         showPageA.value = false
//     }
//   } catch (error) {
//     console.error('获取国家信息失败：', error);
//   }
// });
</script>

<style scoped>
/* 样式保持不变 */
.ab-container {
    max-width: 500px;
    background: #f7f8fa;

    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.seatable-container {
    width: 100%;
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

.bottom {
    position: fixed;
    bottom: -5px;
    left: 0px;
    z-index: 10;
    /* background-color: #fff; */
    width: 100%;
}
</style>


<style>
.van-floating-bubble {
    background: #37c200 !important;
}
</style>