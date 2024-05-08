import { createApp } from 'vue'
import Particles from 'vue3-particles'
import App from './App.vue'

import router from './router'
import pinia from '@/stores/index'
import { directive } from '@/utils/directive'
import { setComponents } from '@/utils/components'

// import '@unocss/reset/tailwind.css'
import 'uno.css'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import '@/theme/element/index.scss'

import '@/assets/css/font-awesome.min.css'
import '@/assets/css/iconfont-0708.css'
import '@/theme/index.scss'

// import 'default-passive-events'

const app = createApp(App)

directive(app) // 注册全局自定义指令
setComponents(app) // 注册全局组件

app.use(pinia)
app.use(router)
// app.use(ElementPlus)
app.use(Particles)

app.mount('#app')
