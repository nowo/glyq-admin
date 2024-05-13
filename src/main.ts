import { createApp } from 'vue'
// import Particles from 'vue3-particles'
import Particles from "@tsparticles/vue3";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

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
app.use(Particles, {
    init: async engine => {
        // await loadFull(engine); // you can load the full tsParticles library from "tsparticles" if you need it
        await loadSlim(engine); // or you can load the slim version from "tsparticles-slim" if don't need Shapes or Animations
    },
})

app.mount('#app')
