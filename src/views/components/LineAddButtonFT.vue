<template>
  <div class="line-add-container">
    <!-- 添加按钮 -->
    <button 
      @click="handleAddLine" 
      class="line-btn"
      :disabled="isProcessing"
    >
      <img src="@image/linelogo.png" />
      {{ isProcessing ? '處理中...' : '添加LINE賬號' }}
    </button>

    <!-- 状态提示 -->
    <div 
      v-if="statusMessage" 
      :class="`status-message mt-2 p-2 rounded text-sm ${statusType}`"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  lineList: {
    type: Array,
    // 对象/数组的默认值需用函数返回
    default: () => ([])
  }
})


// 状态管理
const isProcessing = ref(false);
const statusMessage = ref('');
const statusType = ref('');

// line账号
// const lineList = [{
//   id:'jfjf5320',
//   url: 'https://line.me/ti/p/MkbMpsd3r2',
// },{
//   id:'zsw1y',
//   url: 'https://line.me/ti/p/m_PyqSKD7Y',
// },{
//   id:'zbw1n',
//   url: 'https://line.me/ti/p/UwJa5DD-nF',
// }]

// 随机选择一个企业微信账号
const selectRandomWecom = () => {
  const lineList = props.lineList
  const randomIndex = Math.floor(Math.random() * lineList.length);
  return lineList[randomIndex];
};

// 处理添加LINE操作
const handleAddLine = async () => {
  isProcessing.value = true;
  setStatus('正在跳轉到LINE添加頁面...', 'info');
  triggerTikTokConversion()
  try {
    const lineObj = selectRandomWecom()
    console.log(lineObj);
    
    // 1. 打开LINE添加页面
    window.open(lineObj.url, '_blank');
    // window.location.href = 'https://line.me/ti/p/dZG9cwvMLs';
  } catch (error) {
    isProcessing.value = false;
    setStatus('操作失敗，請重試', 'error');
    console.error('添加操作失敗:', error);
  }
};

// 设置状态提示
const setStatus = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
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

    console.log('TikTok Pixel转化事件已触发');
  }
};

// 生成时间戳+随机数格式的event_id
const generateEventId = () => {
  const timestamp = Date.now(); // 毫秒级时间戳
  const random = Math.floor(Math.random() * 1000000); // 6位随机数
  return `${timestamp}_${random}`;
};

</script>

<style scoped lang="less">
.line-btn {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  background-color: #35c300;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  img {
    width: 50px;
    margin-right: 10px;
  }
}

.line-btn:hover:not(:disabled) {
  background-color: #35c300;
}

.line-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-message {
  transition: opacity 0.3s;
}

/* 状态样式 */
.info {
  background-color: #e6f7ff;
  color: #1890ff;
}

.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.error {
  background-color: #fff2f0;
  color: #f5222d;
}

.warning {
  background-color: #fffbe6;
  color: #faad14;
}
</style>
