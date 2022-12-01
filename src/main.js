import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ElementPlus from './configElement'
import 'element-plus/dist/index.css'

import { useREM } from './utils/flexible'

useREM()
createApp(App).use(router).use(ElementPlus).mount('#app')
