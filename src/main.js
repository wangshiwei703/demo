import { createApp } from 'vue'
import App from './App.vue'

import '@style/css/index.css'
// import "./axios"

import router from './router'


import Plugins from "@/plugins"

import '@/assets/icon/iconfont.js'
import '@/assets/icon/iconfont.css'

const app = createApp(App)
app.use(router)
app.use(Plugins)
app.mount('#app')
