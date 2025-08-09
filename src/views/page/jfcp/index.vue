<template>
  <div class="vite-vue3-template-root" ref="scrollContainer">
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
</template>


<script setup>
import LineAddButton from '../../components/LineAddButtonRY.vue';
import homeHeader from './components/header.vue';
import replyDialog from "./components/replyDialog.vue";
import { ref, nextTick } from "vue";

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