<template>
  <div class="ab-container">
    <!-- A页：审核人员及非TikTok用户可见（完全合规内容） -->
    <div v-if="showPageA" class="page-a">
      <img src="@image/zycpA.jpg" style="width: 100%;height: 100%;" />
      <div class="bottom"  style="display: flex;justify-content: space-around;">
        <LineAddButton />
      </div>
    </div>

    <!-- B页：真实TikTok用户可见（定制化内容） -->
    <div v-else class="vite-vue3-template-root" ref="scrollContainer">
      <div class="header">
        <homeHeader></homeHeader>
      </div>
      <div class="main">
        <replyDialog @addButton="handelAddButton" @scrollToBottom="scrollToBottom"></replyDialog>
      </div>
      <div class="bottom" v-if="addButtonShow">
        <LineAddButton :lineList="parentLineList"/>
      </div>
    </div>
  </div>
</template>


<script setup>
import LineAddButton from '../../components/LineAddButtonRY.vue';
import homeHeader from './components/header.vue';
import replyDialog from "./components/replyDialog.vue";
import { ref, nextTick, onMounted } from "vue";

// line账号
const parentLineList = [{
  id:'jfjf5320',
  url: 'https://line.me/ti/p/MkbMpsd3r2',
},{
  id:'zsw1y',
  url: 'https://line.me/ti/p/m_PyqSKD7Y',
},{
  id:'zbw1n',
  url: 'https://line.me/ti/p/UwJa5DD-nF',
}]



// 添加
const addButtonShow = ref(false)

const handelAddButton = () => {
  addButtonShow.value = true
}


// 滚动
const scrollContainer = ref(null)
// 滚动到底部的方法
const scrollToBottom = () => {
  // 确保容器存在
  if (!scrollContainer.value) return;

  // 使用nextTick确保DOM已更新
  nextTick(() => {
    const container = scrollContainer.value;
    // 平滑滚动到底部（移动端友好）
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'  // 平滑滚动效果
    });
  });
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

<style scoped lang="less">
.vite-vue3-template-root {
  width: 100%;
  // min-height: 100%;
  background-color: #f5f5f5;
  height: 100vh;
  overflow-y: auto; /* 关键：允许容器滚动 */
  -webkit-overflow-scrolling: touch; /* 移动端滚动优化 */
  box-sizing: border-box; /* 确保padding不影响整体尺寸 */
  padding-bottom: 30px;

  .bottom {
    display: flex;
    justify-content: space-around;
    padding-bottom: 30px;
  }
}
</style>