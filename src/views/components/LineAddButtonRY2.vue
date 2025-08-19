<template>
  <div class="line-add-container">
    <!-- 添加按钮 -->
    <img src="@image/lineButton.gif" @click="handleAddLine" />

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
const statusMessage = ref('');
const statusType = ref('');


// 随机选择一个企业微信账号
const selectRandomWecom = () => {
  const lineList = props.lineList
  const randomIndex = Math.floor(Math.random() * lineList.length);
  return lineList[randomIndex];
};

// 处理添加LINE操作
const handleAddLine = async () => {
  setStatus('LINE追加ページに移動しています...', 'info');
  triggerTikTokConversion()
  try {
    const lineObj = selectRandomWecom()
    console.log(lineObj);
    
    // 1. 打开LINE添加页面
    window.open(lineObj.url, '_blank');
    // window.location.href = 'https://line.me/ti/p/dZG9cwvMLs';
  } catch (error) {
    setStatus('操作が失敗しました。再試行してください。', 'error');
    console.error('追加操作が失敗しました:', error);
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
.line-add-container{
  text-align: center;
  img {
    width: 300px;
  }
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
