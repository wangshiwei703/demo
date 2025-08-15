<template>
    <div class="ab-container">
        <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
        <div v-if="showPageA" class="page-a" style="padding-bottom: 60px;">
            <img src="@image/jfcp-header.png" class="a-image" style="width: 100%;height: 100%;" />
            <div class="bottom" style="display: flex;justify-content: space-around;">
                <LineAddButton />
            </div>
            <div class="seatable-container-form">
                <formComponent @addNewData="addNewData" :addNewDataShow="addNewDataShow"></formComponent>
            </div>
        </div>

        <div v-else class="seatable-container" style="padding-bottom: 60px;">
            <div class="seatable-container-header">
                <homeHeader></homeHeader>
            </div>
            <div class="seatable-container-form">
                <formComponent @addNewData="addNewData" :addNewDataShow="addNewDataShow"></formComponent>
            </div>
            <div class="seatable-container-header">
                <homeHeader2></homeHeader2>
            </div>

            <div class="seatable-container-form">
                <formComponent @addNewData="addNewData" :addNewDataShow="addNewDataShow"></formComponent>
            </div>

            <ScrollButtons></ScrollButtons>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import formComponent from './components/form.vue'
import homeHeader from './components/header.vue'
import homeHeader2 from './components/header2.vue'
import ScrollButtons from '../../components/ScrollButtons.vue';
import { showSuccessToast, showFailToast } from 'vant';
import axios from 'axios';
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


// 页面状态
const showPageA = ref(true);
// 参数存储（用于页面展示调试）
const utmSource = ref('');
const utmMedium = ref('');
const utmCampaign = ref('');
const ttclid = ref('');

onMounted(() => {
  // 解析URL所有参数
  const urlParams = new URLSearchParams(window.location.search);

  // 提取三个UTM参数和ttclid
  utmSource.value = urlParams.get('utm_source') || '';
  utmMedium.value = urlParams.get('utm_medium') || '';
  utmCampaign.value = urlParams.get('utm_campaign') || '';
  ttclid.value = urlParams.get('ttclid') || '';

  // 执行判断逻辑
  judgePage();
});

// 核心判断逻辑：联合检测三个UTM参数
function judgePage() {
  // 辅助函数：判断参数是否为宏变量格式（__XXX__）
  const isMacro = (param) => param.startsWith('__') && param.endsWith('__');

  // 规则1：三个UTM参数均为宏变量 → 审核场景（A页面）
  const allAreMacro = isMacro(utmSource.value) &&
    isMacro(utmMedium.value) &&
    isMacro(utmCampaign.value);

  // 规则2：UTM参数为_test_且有ttclid → 测试场景（B页面）
  const isTestScene = utmSource.value === '_test_' &&
    utmMedium.value === '_test_' &&
    utmCampaign.value === '_test_' &&
    !!ttclid.value;

  // 规则3：UTM参数已替换为真实值且有ttclid → 真实用户（B页面）
  const isRealUser = !allAreMacro &&
    !isTestScene &&
    !!ttclid.value &&
    utmSource.value !== '';

  // 页面切换
  if (allAreMacro) {
    showPageA.value = true;
  } else if (isTestScene || isRealUser) {
    showPageA.value = false;
  } else {
    // 未知场景默认A页面（安全兜底）
    showPageA.value = true;
  }

  // 调试日志
  console.log('判断结果：', {
    allAreMacro,
    isTestScene,
    isRealUser,
    showPageA: showPageA.value
  });
}
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