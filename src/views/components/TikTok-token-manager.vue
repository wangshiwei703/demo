<template>
  <div class="min-h-screen bg-gradient-to-r bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TikTok Token Manager
        </h1>
        <div class="flex items-center space-x-2">
          <button 
            @click="toggleDarkMode"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="切换主题"
          >
            <i class="fa" :class="isDarkMode ? 'fa-sun-o' : 'fa-moon-o'"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 状态卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transform hover:shadow-xl transition-all">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">当前 Token 状态</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">Access Token</div>
            <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg break-all text-sm font-mono">
              <span v-if="tokenData.access_token" class="text-gray-800 dark:text-gray-200">
                {{ tokenData.access_token.substring(0, 20) }}...
                <button 
                  @click="copyToClipboard(tokenData.access_token)"
                  class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fa fa-copy"></i>
                </button>
              </span>
              <span v-else class="text-gray-400 italic">未获取</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">Refresh Token</div>
            <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg break-all text-sm font-mono">
              <span v-if="tokenData.refresh_token" class="text-gray-800 dark:text-gray-200">
                {{ tokenData.refresh_token.substring(0, 20) }}...
                <button 
                  @click="copyToClipboard(tokenData.refresh_token)"
                  class="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fa fa-copy"></i>
                </button>
              </span>
              <span v-else class="text-gray-400 italic">未获取</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">过期时间</div>
            <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <span v-if="tokenData.expires_in" class="text-gray-800 dark:text-gray-200">
                {{ expiresAt ? formatDate(expiresAt) : '计算中...' }}
                <span class="ml-2 text-xs px-2 py-1 rounded-full" 
                  :class="isExpired ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'">
                  {{ isExpired ? '已过期' : '有效' }}
                </span>
              </span>
              <span v-else class="text-gray-400 italic">未设置</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">Token 类型</div>
            <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <span class="text-gray-800 dark:text-gray-200">{{ tokenData.token_type || '未设置' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作表单 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 获取 Access Token 表单 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">获取 Access Token</h2>
          
          <form @submit.prevent="getAccessToken" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
              <input
                type="text"
                v-model="form.clientId"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入你的 Client ID"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
              <input
                type="text"
                v-model="form.clientSecret"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入你的 Client Secret"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">授权码 (Code)</label>
              <input
                type="text"
                v-model="form.code"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="手动输入授权码"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redirect URI</label>
              <input
                type="url"
                v-model="form.redirectUri"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入回调 URL"
                required
              >
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="isLoading" class="fa fa-spinner fa-spin mr-2"></i>
              获取 Access Token
            </button>
          </form>
        </div>
        
        <!-- 刷新 Token 表单 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">刷新 Access Token</h2>
          
          <form @submit.prevent="refreshAccessToken" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
              <input
                type="text"
                v-model="refreshForm.clientId"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入你的 Client ID"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Secret</label>
              <input
                type="text"
                v-model="refreshForm.clientSecret"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入你的 Client Secret"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refresh Token</label>
              <input
                type="text"
                v-model="refreshForm.refreshToken"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="输入刷新令牌"
                required
              >
            </div>
            
            <button
              type="submit"
              :disabled="isRefreshLoading || !tokenData.refresh_token"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="isRefreshLoading" class="fa fa-spinner fa-spin mr-2"></i>
              刷新 Access Token
            </button>
          </form>
        </div>
      </div>
      
      <!-- 日志区域 -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">操作日志</h2>
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto text-sm font-mono">
          <div v-for="(log, index) in logs" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-0 last:mb-0 last:pb-0">
            <span class="text-gray-500 dark:text-gray-400">{{ log.timestamp }}</span>
            <span class="ml-2" :class="log.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
              {{ log.message }}
            </span>
          </div>
          <div v-if="logs.length === 0" class="text-gray-400 italic">暂无操作记录</div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>TikTok Token Manager - 用于管理 TikTok API 访问令牌的工具</p>
      </div>
    </footer>

    <!-- 通知提示 -->
    <div 
      v-if="notification.show"
      class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center transform transition-all duration-300 ease-out translate-y-0 opacity-100"
      :class="notification.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/80 dark:text-green-100' : 'bg-red-50 text-red-800 dark:bg-red-900/80 dark:text-red-100'"
    >
      <i :class="notification.type === 'success' ? 'fa fa-check-circle mr-2' : 'fa fa-exclamation-circle mr-2'"></i>
      <span>{{ notification.message }}</span>
      <button 
        @click="notification.show = false"
        class="ml-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';

// 主题模式
const isDarkMode = ref(false);

// Token 数据
const tokenData = reactive({
  access_token: '',
  refresh_token: '',
  expires_in: 0,
  token_type: ''
});

// 获取 Token 表单
const form = reactive({
  clientId: '',
  clientSecret: '',
  code: '',
  redirectUri: ''
});

// 刷新 Token 表单
const refreshForm = reactive({
  clientId: '',
  clientSecret: '',
  refreshToken: ''
});

// 状态变量
const isLoading = ref(false);
const isRefreshLoading = ref(false);
const logs = ref([]);

// 通知提示
const notification = reactive({
  show: false,
  message: '',
  type: 'success' // success 或 error
});

// 计算过期时间点
const expiresAt = computed(() => {
  if (!tokenData.expires_in) return null;
  // 假设 expires_in 是以秒为单位
  return new Date(Date.now() + tokenData.expires_in * 1000);
});

// 判断是否已过期
const isExpired = computed(() => {
  if (!expiresAt.value) return false;
  return new Date() > expiresAt.value;
});

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

// 格式化日期
const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

// 添加日志
const addLog = (message, isError = false) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.unshift({
    timestamp,
    message,
    type: isError ? 'error' : 'success'
  });
  
  // 限制日志数量
  if (logs.value.length > 20) {
    logs.value.pop();
  }
  
  // 保存到本地存储
  saveToLocalStorage();
};

// 显示通知
const showNotification = (message, type = 'success') => {
  notification.show = true;
  notification.message = message;
  notification.type = type;
  
  // 3秒后自动关闭
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('已复制到剪贴板');
    })
    .catch(err => {
      showNotification(`复制失败: ${err.message}`, 'error');
    });
};

// 保存数据到本地存储
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('tiktokTokenData', JSON.stringify(tokenData));
    localStorage.setItem('tiktokFormData', JSON.stringify(form));
    localStorage.setItem('tiktokLogs', JSON.stringify(logs.value));
  } catch (err) {
    console.error('保存到本地存储失败:', err);
  }
};

// 从本地存储加载数据
const loadFromLocalStorage = () => {
  try {
    const tokenDataStr = localStorage.getItem('tiktokTokenData');
    const formDataStr = localStorage.getItem('tiktokFormData');
    const logsStr = localStorage.getItem('tiktokLogs');
    
    if (tokenDataStr) {
      const savedTokenData = JSON.parse(tokenDataStr);
      Object.assign(tokenData, savedTokenData);
    }
    
    if (formDataStr) {
      const savedFormData = JSON.parse(formDataStr);
      Object.assign(form, savedFormData);
    }
    
    if (logsStr) {
      logs.value = JSON.parse(logsStr);
    }
  } catch (err) {
    console.error('从本地存储加载失败:', err);
  }
};

// 获取 Access Token
const getAccessToken = async () => {
  isLoading.value = true;
  addLog('开始获取 access_token...');
  
  try {
    // 实际项目中应替换为你的后端API，避免在前端暴露clientSecret
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: form.clientId,
        client_secret: form.clientSecret,
        code: form.code,
        grant_type: 'authorization_code',
        redirect_uri: form.redirectUri
      })
    });
    
    const data = await response.json();
    
    if (data.code === 0 && data.data) {
      tokenData.access_token = data.data.access_token;
      tokenData.refresh_token = data.data.refresh_token;
      tokenData.expires_in = data.data.expires_in;
      tokenData.token_type = 'Bearer';
      
      addLog('access_token 获取成功');
      showNotification('Access Token 获取成功');
      saveToLocalStorage();
    } else {
      throw new Error(data.message || '获取 access_token 失败');
    }
  } catch (err) {
    addLog(`获取失败: ${err.message}`, true);
    showNotification(`获取失败: ${err.message}`, 'error');
    console.error('获取 access_token 错误:', err);
  } finally {
    isLoading.value = false;
  }
};

// 刷新 Access Token
const refreshAccessToken = async () => {
  isRefreshLoading.value = true;
  addLog('开始刷新 access_token...');
  
  try {
    // 实际项目中应替换为你的后端API，避免在前端暴露clientSecret
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/refresh_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: refreshForm.clientId,
        client_secret: refreshForm.clientSecret,
        refresh_token: refreshForm.refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    const data = await response.json();
    
    if (data.code === 0 && data.data) {
      tokenData.access_token = data.data.access_token;
      tokenData.refresh_token = data.data.refresh_token;
      tokenData.expires_in = data.data.expires_in;
      tokenData.token_type = 'Bearer';
      
      addLog('access_token 刷新成功');
      showNotification('Access Token 刷新成功');
      saveToLocalStorage();
    } else {
      throw new Error(data.message || '刷新 access_token 失败');
    }
  } catch (err) {
    addLog(`刷新失败: ${err.message}`, true);
    showNotification(`刷新失败: ${err.message}`, 'error');
    console.error('刷新 access_token 错误:', err);
  } finally {
    isRefreshLoading.value = false;
  }
};

// 监听主题变化并应用到 DOM
watch(isDarkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// 当 tokenData 变化时同步到刷新表单
watch(tokenData, (newVal) => {
  refreshForm.refreshToken = newVal.refresh_token || '';
  // 保持 clientId 和 clientSecret 同步
  if (newVal.access_token) {
    refreshForm.clientId = form.clientId;
    refreshForm.clientSecret = form.clientSecret;
  }
}, { deep: true });

// 初始化
onMounted(() => {
  // 初始化主题
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  isDarkMode.value = prefersDark;
  
  // 从本地存储加载数据
  loadFromLocalStorage();
});
</script>

<style scoped>
/* 基础样式扩展 */
.dark {
  color-scheme: dark;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
