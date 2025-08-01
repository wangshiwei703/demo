import { createApp } from 'vue'
import App from './App.vue'

import '@style/css/index.css'
// import "./axios"

import router from './router'

//  加载ws
// import Plugins from "@/plugins"


// // 初始化TikTok Pixel
// function initTikTokPixel() {
//   if (window.ttq) return;
  
//   !function(e,t,n,s,u,a){
//     e[t]=e[t]||function(){(e[t].q=e[t].q||[]).push(arguments)},
//     e[t].l=1*new Date,u=n.createElement(s),
//     a=n.getElementsByTagName(s)[0],u.async=1,
//     u.src="https://analytics.tiktok.com/i18n/pixel/sdk.js",
//     a.parentNode.insertBefore(u,a)
//   }(window,"ttq","document","script");
  
//   // 替换为你的TikTok Pixel ID
//   ttq.init('D25ECBJC77U1E84BDC3G');
// }

// // 在应用挂载前初始化
// initTikTokPixel();

const app = createApp(App)
app.use(router)
// app.use(Plugins)
app.mount('#app')
