<template>

  <div class="ab-container">
    <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
    <div v-if="showPageA" class="page-a">
      <h2>合规产品介绍</h2>
      <p>符合平台政策的产品说明、资质证明、正规服务流程...</p>
      <div class="compliance-info">
        <p>资质编号：XXX-XXXX-XXXX</p>
        <p>服务条款：[链接至合规条款]</p>
      </div>
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


const showPageA = ref(true); // 默认展示A页（审核安全）

onMounted(() => {
  // 延迟检测，确保TikTok环境变量加载完成
  const timer = setTimeout(() => {
    // 直接判断是否来自TikTok相关场景
    const isFromTikTok = checkTikTokSource();
    showPageA.value = !isFromTikTok;
    clearTimeout(timer);

  }, 500);
});

// 核心判断逻辑：直接检测来源
function checkTikTokSource() {
  // 1. 检测是否在TikTok内置浏览器中（不跳转场景）
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTikTokWebView = userAgent.includes('tiktok') || userAgent.includes('tiktoklite');

  // 2. 检测是否从TikTok跳转而来（广告跳转场景）
  // referrer会包含跳转前的页面URL，TikTok广告跳转可能包含其域名
  const referrer = document.referrer.toLowerCase();
  const isFromTikTokReferrer = referrer.includes('tiktok.com') ||
    referrer.includes('tiktokcdn.com') ||
    referrer.includes('toutiao.com'); // 字节系相关域名

  // 3. 综合判断：满足任一条件即视为来自TikTok
  const result = isTikTokWebView || isFromTikTokReferrer;

  // 输出判断依据（开发调试用）
  console.log('来源判断依据：', {
    userAgent,
    isTikTokWebView,
    referrer,
    isFromTikTokReferrer,
    finalResult: result
  });

  return result;
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