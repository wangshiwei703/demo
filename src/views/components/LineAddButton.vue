<template>
  <div class="line-add-container">
    <!-- 添加按钮 -->
    <button 
      @click="handleAddLine" 
      class="line-btn"
      :disabled="isProcessing"
    >
      <img src="@image/linelogo.png" />
      {{ isProcessing ? '处理中...' : '添加LINE账号' }}
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// 状态管理
const isProcessing = ref(false);
const statusMessage = ref('');
const statusType = ref('');
const lineUserId = ref('');
const checkInterval = ref(null);

// 环境变量（在.env文件中配置）
// const LINE_LIFF_ID = import.meta.env.VITE_LINE_LIFF_ID;
// const LINE_ADD_URL = import.meta.env.VITE_LINE_ADD_URL;

// 初始化LINE LIFF
onMounted(async () => {
  // try {
  //   // 加载LINE LIFF SDK
  //   const script = document.createElement('script');
  //   script.src = 'https://d.line-scdn.net/liff/1.0/sdk.js';
  //   script.onload = initLiff;
  //   document.head.appendChild(script);
  // } catch (error) {
  //   setStatus('LINE服务初始化失败，请稍后再试', 'error');
  //   console.error('LINE初始化失败:', error);
  // }
});

// 初始化LIFF
const initLiff = async () => {
  try {
    await window.liff.init({ liffId: LINE_LIFF_ID });
    
    // 检查登录状态
    if (!window.liff.isLoggedIn()) {
      // 引导用户登录LINE
      window.liff.login();
    } else {
      // 获取用户LINE ID
      const profile = await window.liff.getProfile();
      lineUserId.value = profile.userId;
      console.log('LINE用户ID:', lineUserId.value);
    }
  } catch (error) {
    setStatus('LINE登录失败，请重试', 'error');
    console.error('LIFF初始化错误:', error);
  }
};

// 处理添加LINE操作
const handleAddLine = async () => {
  // if (!lineUserId.value) {
  //   setStatus('请先登录LINE账号', 'error');
  //   return;
  // }

  isProcessing.value = true;
  setStatus('正在跳转到LINE添加页面...', 'info');
  triggerTikTokConversion()
  try {
    // 1. 打开LINE添加页面
    window.open('https://line.me/ti/p/dZG9cwvMLs', '_blank');
    // window.location.href = 'https://line.me/ti/p/dZG9cwvMLs';
    
    // 2. 2秒后开始验证（等待用户操作）
    // setTimeout(() => {
    //   startVerification();
    // }, 2000);
  } catch (error) {
    isProcessing.value = false;
    setStatus('操作失败，请重试', 'error');
    console.error('添加操作失败:', error);
  }
};

// 启动验证轮询
const startVerification = () => {
  // 每15秒检查一次
  checkInterval.value = setInterval(async () => {
    try {
      // 调用Netlify云函数验证关注状态
      const response = await fetch('/.netlify/functions/verify-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineUserId: lineUserId.value })
      });

      const result = await response.json();
      
      if (result.followed) {
        // 验证成功，触发TikTok Pixel
        clearInterval(checkInterval.value);
        isProcessing.value = false;
        setStatus('LINE添加成功！感谢您的关注', 'success');
        
        // 触发TikTok转化事件
        if (window.ttq) {
          window.ttq.track('CompleteRegistration', {
            content_name: 'LINE企业账号关注成功',
            content_type: 'social',
            line_user_id: lineUserId.value,
            value: 0 // 可设置转化价值
          });
        }
      }
    } catch (error) {
      console.error('验证请求失败:', error);
      setStatus('验证中...(网络可能有延迟)', 'warning');
    }
  }, 15000);

  // 5分钟后停止检查
  setTimeout(() => {
    clearInterval(checkInterval.value);
    if (isProcessing.value) {
      isProcessing.value = false;
      setStatus('验证超时，请确认是否已添加', 'warning');
    }
  }, 5 * 60 * 1000);
};

// 设置状态提示
const setStatus = (message, type) => {
  statusMessage.value = message;
  statusType.value = type;
};


// 触发TikTok Pixel转化事件
const triggerTikTokConversion = () => {
  // window.tiktokPixel
  if (window.ttq) {
    // window.ttq.track('CompleteRegistration', {
    //   contents: [
    //     {
    //       content_id: selectedWecom.value.id,
    //       content_name: '企业微信添加成功',
    //       content_type: 'wecom',
    //     }],
    //   value: 1,
    //   currency: 'CNY'
    // }, {
    //   event_id: generateEventId()
    // });



    // window.ttq.track('Contact', {
    //   contents: [
    //     {
    //       content_id: selectedWecom.value.id,
    //       content_name: '企业微信添加成功Contact',
    //       content_type: 'wecom',
    //     }],
    //   value: 1,
    //   currency: 'CNY'
    // }, {
    //   event_id: generateEventId()
    // });

    window.ttq.track('ClickButton', {
      contents: [
        {
          content_id: 'lineId',
          content_name: '企业微信添加成功ClickButton',
          content_type: 'wecom',
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

// 组件卸载时清理
onUnmounted(() => {
  // if (checkInterval.value) {
  //   clearInterval(checkInterval.value);
  // }
});
</script>

<style scoped lang="less">
.line-btn {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  background-color: #5ACF36;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  img {
    width: 30px;
  }
}

.line-btn:hover:not(:disabled) {
  background-color: #5ACF36;
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
