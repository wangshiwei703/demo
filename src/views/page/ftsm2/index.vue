<!-- tk投放 -->
<template>
    <div class="ab-container">
        <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
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
import ScrollButtons from '../../components/ScrollButtons.vue';
import { useWindowSize } from '@vant/use';
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
    if (window.ttq) {
        window.ttq.track('ClickButton', {
            contents: [
                {
                    content_id: 'lineId',
                    content_name: 'Line添加成功',
                    content_type: 'line',
                }],
            value: 1,
            currency: 'CNY'
        }, {
            event_id: generateEventId()
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

    // 默认高度
    const { width, height } = useWindowSize();
    bubbleOffset.value.y = height.value - 260
    bubbleOffset.value.x = width.value - 72
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


const bubbleOffset = ref({ x: 0, y: 0 });
</script>

<style scoped>
/* 样式保持不变 */
.ab-container {
    max-width: 500px;
    background: #f7f8fa;
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
    bottom: 0px;
    left: 0px;
    z-index: 10;
    background-color: #fff;
    width: 100%;
}
</style>


<style>
.van-floating-bubble {
    background: #37c200 !important;
}
</style>