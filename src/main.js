import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css'

// import "./axios"

import router from './router'

//  加载ws
// import Plugins from "@/plugins"



// 保存原生 fetch 方法------接口拦截
const originalFetch = window.fetch;

// 重写 fetch 方法
window.fetch = async (input, init) => {
  // 处理请求地址（input 可能是字符串或 Request 对象）
  let url = typeof input === 'string' ? input : input.url;

  // 匹配需要拦截的地址，例如包含 "https://cloud.seatable.cn/api-gateway/" 的请求
  const targetRegex = /^https:\/\/cloud\.seatable\.cn\/api-gateway\//;
  if (targetRegex.test(url)) {
    // 替换为代理路径（例如将 https://cloud.seatable.cn/api-gateway/... 改为 /seatable-api/api-gateway/...）
    url = url.replace(targetRegex, '/seatable-api/api-gateway/');
  }

  // 重新构造请求参数（如果 input 是 Request 对象，需要复制其他属性）
  const newInput = typeof input === 'string' ? url : new Request(url, input);

  // 调用原生 fetch 发起修改后的请求
  return originalFetch(newInput, init);
};



const app = createApp(App)
app.use(router)
// app.use(Plugins)

app.use(Vant);
app.mount('#app')
