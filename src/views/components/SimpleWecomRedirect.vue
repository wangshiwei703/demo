<template>
  <div class="wecom-simple-container">
    <button 
      @click="handleAddWecom" 
      class="add-btn"
      :disabled="isProcessing"
    >
      {{ isProcessing ? '处理中...' : '添加企业微信' }}
    </button>
    
    <!-- 状态提示 -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 多个企业微信账号配置 - 替换为你的实际信息
const wecomAccounts = [
  {
    id: 'wecom_001',
    redirectUrl: 'https://work.weixin.qq.com/ca/cawcdeb8aa5ccdc1fe', // 企业微信添加链接1
    agentId: '1000008', // text应用
    userId: '18339702670'
  },
  // {
  //   id: 'wecom_002',
  //   redirectUrl: 'https://work.weixin.qq.com/ca/cawcdeb8aa5ccdc1fe', // 企业微信添加链接2
  //   agentId: 'agent2_id',
  //   userId: '18339702670'
  // },
  // {
  //   id: 'wecom_003',
  //   redirectUrl: 'https://work.weixin.qq.com/ca/cawcdeb8aa5ccdc1fe', // 企业微信添加链接3
  //   agentId: 'agent3_id',
  //   userId: '18339702670'
  // }
];

// 状态管理
const isProcessing = ref(false);
const statusMessage = ref('');
const statusType = ref('');
const selectedWecom = ref(null);
const checkInterval = ref(null);

// 随机选择一个企业微信账号
const selectRandomWecom = () => {
  const randomIndex = Math.floor(Math.random() * wecomAccounts.length);
  selectedWecom.value = wecomAccounts[randomIndex];
};

// 处理添加企业微信
const handleAddWecom = () => {
  isProcessing.value = true;
  statusMessage.value = '正在准备添加链接...';
  statusType.value = 'info';
  
  // 随机选择一个企业微信账号
  selectRandomWecom();
  // 验证成功，触发TikTok转化测试
  triggerTikTokConversion()

  // 延迟跳转，显示状态提示
  setTimeout(() => {
    if (selectedWecom.value) {
      // 跳转到企业微信添加页面
      // window.location.href = selectedWecom.value.redirectUrl;
      // 打开新页面
      window.open(selectedWecom.value.redirectUrl, '_blank');
      
      // 显示提示信息
      statusMessage.value = '已跳转至企业微信，请完成添加...';
      statusType.value = 'info';
      
      // 开始定期检查添加状态（5分钟内，每30秒检查一次）
      startCheckingStatus();
    } else {
      isProcessing.value = false;
      statusMessage.value = '获取企业微信信息失败，请重试';
      statusType.value = 'error';
    }
  }, 1000);
};

// 开始检查添加状态
const startCheckingStatus = () => {
  // 首次立即检查
  checkWecomStatus();
  
  // 定时检查（每30秒一次）
  checkInterval.value = setInterval(() => {
    checkWecomStatus();
  }, 30000);
  
  // 5分钟后停止检查
  setTimeout(() => {
    clearInterval(checkInterval.value);
    if (statusType.value !== 'success') {
      statusMessage.value = '检查超时，请手动确认是否添加成功';
      statusType.value = 'warning';
      isProcessing.value = false;
    }
  }, 300000);
};

// 检查企业微信添加状态（通过代理）
const checkWecomStatus = async () => {
  try {
    const response = await axios.post('/.netlify/functions/wecom-proxy', {
      corpId: 'ww60fc23426549ae2b',
      agentId: selectedWecom.value.agentId,
      userId: selectedWecom.value.userId,
      wecomId: selectedWecom.value.id
    });
    
    const result = response.data;
    
    if (result.added) {
      // 验证成功，触发TikTok转化
      triggerTikTokConversion();
      statusMessage.value = '恭喜，已成功添加企业微信！';
      statusType.value = 'success';
      clearInterval(checkInterval.value);
      isProcessing.value = false;
    } else {
      statusMessage.value = '尚未检测到添加记录，若已添加请稍候...';
      statusType.value = 'info';
    }
  } catch (error) {
    console.error('检查添加状态失败:', error);
    statusMessage.value = '检查状态失败，请稍候重试';
    statusType.value = 'error';
  }
};

// 触发TikTok Pixel转化事件
const triggerTikTokConversion = () => {
  // window.tiktokPixel
  if (window.ttq) {
    window.ttq.track('CompleteRegistration', {
      content_name: '企业微信添加成功',
      content_id: selectedWecom.value.id,
      content_type: 'wecom',
      value: 1,
      currency: 'CNY'
    });
    console.log('TikTok Pixel转化事件已触发');
  }
};
</script>

<style scoped>
.wecom-simple-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.add-btn {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  background-color: #07C160;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover:not(:disabled) {
  background-color: #06b356;
}

.add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.status-message {
  margin-top: 1rem;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  max-width: 300px;
  text-align: center;
}

.info {
  background-color: #f0f7ff;
  color: #0066cc;
}

.success {
  background-color: #f0f9f0;
  color: #07C160;
}

.error {
  background-color: #fff2f0;
  color: #e53e3e;
}

.warning {
  background-color: #fffbf0;
  color: #e67700;
}
</style>
