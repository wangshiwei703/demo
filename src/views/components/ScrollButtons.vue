<template>
  <div class="scroll-buttons">
    <!-- 回到顶部按钮 -->
    <van-button
      round
      type="primary"
      icon="arrow-up"
      class="scroll-button top-button"
      @click="scrollToTop"
      :disabled="isTop"
    />
    
    <!-- 滚动到底部按钮 -->
    <van-button
      round
      type="info"
      icon="arrow-down"
      class="scroll-button bottom-button"
      @click="scrollToBottom"
      :disabled="isBottom"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 跟踪滚动状态
const scrollTop = ref(0);
// 页面总高度
const pageHeight = ref(0);
// 视口高度
const clientHeight = ref(0);

// 计算是否在顶部
const isTop = computed(() => scrollTop.value < 10);

// 计算是否在底部
const isBottom = computed(() => {
  // 考虑到滚动可能有误差，设置一个10px的缓冲
  return scrollTop.value + clientHeight.value >= pageHeight.value - 10;
});

// 监听滚动事件
const handleScroll = () => {
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop;
  clientHeight.value = window.innerHeight;
  pageHeight.value = document.documentElement.scrollHeight;
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 平滑滚动
  });
};

// 滚动到底部
const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth' // 平滑滚动
  });
};

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // 初始化计算
  handleScroll();
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-buttons {
  position: fixed;
  right: 20px;
  bottom: 80px; /* 预留底部空间，避免被其他元素遮挡 */
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 999; /* 确保按钮在其他内容上方 */
}

.scroll-button {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 禁用状态样式 */
.scroll-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 适配不同屏幕尺寸 */
@media (max-width: 375px) {
  .scroll-button {
    width: 50px;
    height: 50px;
  }
  
  .scroll-buttons {
    right: 16px;
    bottom: 70px;
  }
}
</style>
