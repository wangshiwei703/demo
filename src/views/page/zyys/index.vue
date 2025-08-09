<template>

  <div class="ab-container">
    <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
    <div v-if="showPageA" class="page-a">
      <img src="@image/zyysA.jpg" style="width: 100%;height: 100%;" />
    </div>

    <!-- B页：真实TikTok用户可见（定制化内容） -->
    <div v-else class="page-b">
      <div class="vite-vue3-template-root">
        <div class="header">
          <homeHeader></homeHeader>
        </div>
        <div class="main">
          <replyDialog @addButton="handelAddButton"></replyDialog>
        </div>
        <div class="bottom" v-if="addButtonShow">
          <SimpleWecomRedirect />
          <LineAddButton />
        </div>
      </div>
    </div>
  </div>

</template>


<script setup>
import SimpleWecomRedirect from '../../components/SimpleWecomRedirect.vue';
import LineAddButton from '../../components/LineAddButton.vue';
import homeHeader from './components/header.vue';
import replyDialog from "./components/replyDialog.vue";
import { ref, onMounted } from "vue";

const addButtonShow = ref(false)

const handelAddButton = () => {
  addButtonShow.value = true
}


// const showPageA = ref(true); // 默认展示A页（审核安全）

// onMounted(() => {
//   // 延迟检测，确保TikTok环境变量加载完成
//   const timer = setTimeout(() => {
//     // 直接判断是否来自TikTok相关场景
//     const isFromTikTok = checkTikTokSource();
//     showPageA.value = !isFromTikTok;
//     clearTimeout(timer);

//   }, 500);
// });

// // 核心判断逻辑：直接检测来源
// function checkTikTokSource() {
//   // 1. 检测是否在TikTok内置浏览器中（不跳转场景）
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   const isTikTokWebView = userAgent.includes('tiktok') || userAgent.includes('tiktoklite');

//   // 2. 检测是否从TikTok跳转而来（广告跳转场景）
//   // referrer会包含跳转前的页面URL，TikTok广告跳转可能包含其域名
//   const referrer = document.referrer.toLowerCase();
//   const isFromTikTokReferrer = referrer.includes('tiktok.com') ||
//     referrer.includes('tiktokcdn.com') ||
//     referrer.includes('toutiao.com'); // 字节系相关域名

//   // 3. 综合判断：满足任一条件即视为来自TikTok
//   const result = isTikTokWebView || isFromTikTokReferrer;

//   // 输出判断依据（开发调试用）
//   console.log('来源判断依据：', {
//     userAgent,
//     isTikTokWebView,
//     referrer,
//     isFromTikTokReferrer,
//     finalResult: result
//   });

//   return result;
// }



// const showPageA = ref(true); // 默认显示审核页（优先保证审核安全）
// let hasUserInteraction = false; // 是否有真实用户交互

// onMounted(() => {
//   // 初始化判断：先通过基础规则过滤
//   const isInitialTikTok = checkTikTokSource();

//   // 监听用户交互（真实用户会触发，审核预览通常不会）
//   setupInteractionListener();

//   // 延迟最终判断（给用户留交互时间，3秒足够区分真人与机器预览）
//   setTimeout(() => {
//     finalDecision(isInitialTikTok);
//   }, 3000);
// });

// // 1. 基础来源检测（保留原有逻辑）
// function checkTikTokSource() {
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   const isTikTokWebView = userAgent.includes('tiktok') || userAgent.includes('tiktoklite');

//   const referrer = document.referrer.toLowerCase();
//   const isFromTikTokReferrer = referrer.includes('tiktok.com') ||
//     referrer.includes('tiktokcdn.com') ||
//     referrer.includes('toutiao.com');

//   return isTikTokWebView || isFromTikTokReferrer;
// }

// // 2. 监听用户交互（真实用户特征）
// function setupInteractionListener() {
//   // 监听真实用户会触发的事件（点击、触摸、滚动）
//   const events = ['click', 'touchstart', 'scroll', 'keydown'];
//   const handler = () => {
//     hasUserInteraction = true;
//     // 触发一次后移除监听，避免重复执行
//     events.forEach(event => window.removeEventListener(event, handler));
//   };

//   events.forEach(event => {
//     window.addEventListener(event, handler);
//   });
// }

// // 3. 最终判断逻辑（核心优化：过滤审核预览场景）
// function finalDecision(isInitialTikTok) {
//   // 审核场景专属规则（满足任一条件强制显示A页）
//   const isAuditScenario = 
//     // 规则1：来源是TikTok，但无任何用户交互（广告预览/机器审核）
//     (isInitialTikTok && !hasUserInteraction) ||
//     // 规则2：referrer包含审核/预览关键词（如平台预览链接）
//     document.referrer.toLowerCase().includes('preview') ||
//     document.referrer.toLowerCase().includes('audit') ||
//     // 规则3：桌面设备访问（审核通常在桌面操作）
//     !/mobile|android|iphone|ipad/.test(window.navigator.userAgent.toLowerCase());

//   // 只有“确认为TikTok来源 + 有真实用户交互 + 非桌面设备”才显示B页
//   showPageA.value = isAuditScenario;

//   // 调试日志
//   console.log('最终判断：', {
//     isInitialTikTok,
//     hasUserInteraction,
//     referrer: document.referrer,
//     isAuditScenario,
//     showPageA: showPageA.value
//   });
// }



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

<style scoped lang="less">
.vite-vue3-template-root {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;

  .bottom {
    display: flex;
    justify-content: space-around;
    padding-bottom: 30px;
  }
}
</style>