<template>
    <div class="seatable-container">
        <div class="seatable-container-header">
            <homeHeader></homeHeader>
        </div>
        <div class="seatable-container-form">
            <formComponent @addNewData="addNewData" :addNewDataShow="addNewDataShow"></formComponent>
        </div>
        <div class="seatable-container-privacyPolicy" @click="handelPrivacyPolicy">プライバシー保護ポリシー</div>
        <div class="seatable-container-header">
            <homeHeader2></homeHeader2>
        </div>

        <div class="seatable-container-form">
            <formComponent @addNewData="addNewData" :addNewDataShow="addNewDataShow"></formComponent>
        </div>

        <ScrollButtons></ScrollButtons>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import formComponent from './components/form.vue'
import homeHeader from './components/header.vue'
import homeHeader2 from './components/header2.vue'
import ScrollButtons from '../../components/ScrollButtons.vue';
import { showSuccessToast, showFailToast } from 'vant';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
const router = useRouter() 
// 添加数据显隐
const addNewDataShow = ref(false)
const addNewData = async (val) => {
    try {
        const rowData = {
            name: val.name,
            gender: val.gender,
            age: val.age,
            height: val.height,
            currentWeight: val.currentWeight,
            targetWeight: val.targetWeight,
            lineId: val.lineId,
            phone: val.phone,
        };

        const response = await axios.post('https://api.mingdao.com/workflow/hooks/Njg5ZWFlM2JmMzdmM2E2ZjU1MzZkYzk0', rowData);

        if (response.status == 200) {
            addNewDataShow.value = true
            showSuccessToast('追加成功しました');
            triggerTikTokConversion()
        }

    } catch (err) {
        console.error('添加数据错误详情：', err);
        showFailToast('データの追加に失敗しました');
    }
};


const lineList = [{
    id: 'jfjf5320',
    url: 'https://line.me/ti/p/MkbMpsd3r2',
}, {
    id: 'zsw1y',
    url: 'https://line.me/ti/p/m_PyqSKD7Y',
}, {
    id: 'zbw1n',
    url: 'https://line.me/ti/p/UwJa5DD-nF',
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
    if (window.ttq) {
        // window.ttq.track('ClickButton', {
        //     contents: [
        //         {
        //             content_id: 'id',
        //             content_name: '表单填写成功',
        //             content_type: 'line',
        //         }],
        //     value: 1,
        //     currency: 'CNY'
        // });


        window.ttq.track('Lead', {
            contents: [
                {
                    content_id: 'id',
                    content_name: '表单填写成功',
                    content_type: 'line',
                }],
            value: 1,
            currency: 'CNY'
        });
    }
};


// 跳转隐私政策
const handelPrivacyPolicy = () => {
    router.push({
        path: '/privacyPolicy'
    })
}

// 页面加载时自动获取数据
onMounted(() => {
    // fetchTableData();
});
</script>

<style scoped>
/* 样式保持不变 */
.seatable-container {
    width: 100%;
    background: #f7f8fa;
}


.custom {
    width: 80px;
    font-size: 14px;
    text-align: center;
}

.seatable-container-privacyPolicy {
    color: #1989fa;
    font-size: 12px;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
}
</style>


<style>
.van-floating-bubble {
    background: #37c200 !important;
}
</style>