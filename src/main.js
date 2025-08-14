import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css'

// import "./axios"

import router from './router'

//  加载ws
// import Plugins from "@/plugins"


const app = createApp(App)
app.use(router)
// app.use(Plugins)

app.use(Vant);
app.mount('#app')
