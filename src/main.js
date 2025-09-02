import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import "./axios"
import '@style/index.css'

import router from './router'

//  加载ws
// import Plugins from "@/plugins"

const app = createApp(App)
app.use(router)
// app.use(Plugins)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(Vant);
app.mount('#app')
